// src/hooks/useContactForm.ts

import { useState, useCallback } from 'react';
import { 
  type FormData, 
  type ValidationErrors, 
  validateContactForm, 
  sanitizeFormData,
  rateLimiter 
} from '../utils/formSecurity';
import { directusService, type ContactSubmissionData } from '../services/directusService';

interface UseContactFormOptions {
  language: 'es' | 'en';
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface UseContactFormReturn {
  formData: FormData;
  errors: ValidationErrors;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error' | 'rate-limited';
  errorMessage: string;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
  clearError: (field: keyof ValidationErrors) => void;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
  eventType: '',
  eventDate: ''
};

export const useContactForm = ({ 
  language = 'es', 
  onSuccess, 
  onError 
}: UseContactFormOptions): UseContactFormReturn => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'rate-limited'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
    
    // Reset status si había error
    if (submitStatus === 'error') {
      setSubmitStatus('idle');
      setErrorMessage('');
    }
  }, [errors, submitStatus]);

  const clearError = useCallback((field: keyof ValidationErrors) => {
    setErrors(prev => ({
      ...prev,
      [field]: undefined
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
    setSubmitStatus('idle');
    setErrorMessage('');
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting
    const userIdentifier = formData.email || 'anonymous';
    if (!rateLimiter.canAttempt(userIdentifier)) {
      const remainingTime = Math.ceil(rateLimiter.getRemainingTime(userIdentifier) / 1000 / 60);
      setSubmitStatus('rate-limited');
      setErrorMessage(
        language === 'es' 
          ? `Demasiados intentos. Intenta de nuevo en ${remainingTime} minutos.`
          : `Too many attempts. Try again in ${remainingTime} minutes.`
      );
      return;
    }

    // Validación
    const validation = validateContactForm(formData, language);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      // Sanitizar datos
      const cleanData = sanitizeFormData(formData);
      
      // Preparar datos para Directus
      const submissionData: ContactSubmissionData = {
        name: cleanData.name,
        email: cleanData.email,
        phone: cleanData.phone,
        subject: cleanData.subject,
        message: cleanData.message,
        event_type: cleanData.eventType || null,
        event_date: cleanData.eventDate || null,
        status: 'pending'
      };

      console.log('📧 Submitting contact form:', submissionData);

      // Enviar a Directus
      const result = await directusService.submitContactForm(submissionData);
      
      console.log('✅ Contact form submitted successfully:', result);
      
      setSubmitStatus('success');
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Auto-reset status después de 5 segundos
      setTimeout(() => {
        setSubmitStatus('idle');
        resetForm();
      }, 5000);
      
    } catch (error) {
      console.error('❌ Error submitting contact form:', error);
      
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setErrorMessage(errorMsg);
      setSubmitStatus('error');
      
      if (onError) {
        onError(errorMsg);
      }
      
      // Auto-reset status después de 5 segundos
      setTimeout(() => {
        setSubmitStatus('idle');
        setErrorMessage('');
      }, 5000);
      
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, language, onSuccess, onError, resetForm]);

  return {
    formData,
    errors,
    isSubmitting,
    submitStatus,
    errorMessage,
    setFormData,
    handleInputChange,
    handleSubmit,
    resetForm,
    clearError
  };
};