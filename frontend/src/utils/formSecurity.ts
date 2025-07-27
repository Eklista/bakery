// src/utils/formSecurity.ts

export type FormData = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  eventType: string;
  eventDate: string;
}

export type ValidationErrors = {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

// Sanitización básica
export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remover scripts
    .replace(/javascript:/gi, '') // Remover javascript:
    .replace(/on\w+\s*=/gi, '') // Remover event handlers
    .slice(0, 1000); // Limitar longitud
};

// Validación de email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

// Validación de teléfono guatemalteco
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+502\s?)?[0-9]{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Detectar spam básico
export const isSpamContent = (text: string): boolean => {
  const spamKeywords = [
    'viagra', 'casino', 'loan', 'credit', 'bitcoin', 'crypto',
    'investment', 'profit', 'guarantee', 'urgent', 'act now'
  ];
  
  const lowercaseText = text.toLowerCase();
  const hasSpamKeywords = spamKeywords.some(keyword => 
    lowercaseText.includes(keyword)
  );
  
  // Detectar exceso de enlaces
  const linkCount = (text.match(/https?:\/\//g) || []).length;
  const hasExcessiveLinks = linkCount > 2;
  
  // Detectar exceso de mayúsculas
  const upperCaseRatio = (text.match(/[A-Z]/g) || []).length / text.length;
  const hasExcessiveCaps = upperCaseRatio > 0.3 && text.length > 20;
  
  return hasSpamKeywords || hasExcessiveLinks || hasExcessiveCaps;
};

// Rate limiting simple (cliente)
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts = 3;
  private readonly windowMs = 5 * 60 * 1000; // 5 minutos

  canAttempt(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier) || [];
    
    // Filtrar intentos dentro de la ventana de tiempo
    const recentAttempts = userAttempts.filter(
      attempt => now - attempt < this.windowMs
    );
    
    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    // Registrar nuevo intento
    recentAttempts.push(now);
    this.attempts.set(identifier, recentAttempts);
    
    return true;
  }

  getRemainingTime(identifier: string): number {
    const userAttempts = this.attempts.get(identifier) || [];
    if (userAttempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...userAttempts);
    const remainingTime = this.windowMs - (Date.now() - oldestAttempt);
    
    return Math.max(0, remainingTime);
  }
}

export const rateLimiter = new RateLimiter();

// Validación completa del formulario
export const validateContactForm = (
  data: FormData,
  language: 'es' | 'en' = 'es'
): { isValid: boolean; errors: ValidationErrors } => {
  const errors: ValidationErrors = {};
  
  const messages = {
    es: {
      nameRequired: 'El nombre es requerido',
      nameInvalid: 'El nombre debe tener entre 2 y 50 caracteres',
      emailRequired: 'El email es requerido',
      emailInvalid: 'Email inválido',
      phoneRequired: 'El teléfono es requerido',
      phoneInvalid: 'Formato de teléfono inválido (+502 XXXXXXXX)',
      subjectRequired: 'El asunto es requerido',
      subjectInvalid: 'El asunto debe tener entre 5 y 100 caracteres',
      messageRequired: 'El mensaje es requerido',
      messageInvalid: 'El mensaje debe tener entre 10 y 1000 caracteres',
      spamDetected: 'Contenido detectado como spam'
    },
    en: {
      nameRequired: 'Name is required',
      nameInvalid: 'Name must be between 2 and 50 characters',
      emailRequired: 'Email is required',
      emailInvalid: 'Invalid email',
      phoneRequired: 'Phone is required',
      phoneInvalid: 'Invalid phone format (+502 XXXXXXXX)',
      subjectRequired: 'Subject is required',
      subjectInvalid: 'Subject must be between 5 and 100 characters',
      messageRequired: 'Message is required',
      messageInvalid: 'Message must be between 10 and 1000 characters',
      spamDetected: 'Content detected as spam'
    }
  };

  const msg = messages[language];

  // Validar nombre
  if (!data.name.trim()) {
    errors.name = msg.nameRequired;
  } else if (data.name.trim().length < 2 || data.name.trim().length > 50) {
    errors.name = msg.nameInvalid;
  }

  // Validar email
  if (!data.email.trim()) {
    errors.email = msg.emailRequired;
  } else if (!isValidEmail(data.email)) {
    errors.email = msg.emailInvalid;
  }

  // Validar teléfono
  if (!data.phone.trim()) {
    errors.phone = msg.phoneRequired;
  } else if (!isValidPhone(data.phone)) {
    errors.phone = msg.phoneInvalid;
  }

  // Validar asunto
  if (!data.subject.trim()) {
    errors.subject = msg.subjectRequired;
  } else if (data.subject.trim().length < 5 || data.subject.trim().length > 100) {
    errors.subject = msg.subjectInvalid;
  }

  // Validar mensaje
  if (!data.message.trim()) {
    errors.message = msg.messageRequired;
  } else if (data.message.trim().length < 10 || data.message.trim().length > 1000) {
    errors.message = msg.messageInvalid;
  }

  // Detectar spam
  const fullText = `${data.subject} ${data.message}`;
  if (isSpamContent(fullText)) {
    errors.message = msg.spamDetected;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Limpiar datos antes de enviar
export const sanitizeFormData = (data: FormData): FormData => {
  return {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email).toLowerCase(),
    phone: sanitizeInput(data.phone),
    subject: sanitizeInput(data.subject),
    message: sanitizeInput(data.message),
    eventType: sanitizeInput(data.eventType),
    eventDate: data.eventDate // Las fechas no necesitan sanitización
  };
};