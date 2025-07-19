// src/services/groqTranslator.ts
interface GroqResponse {
  choices: [{
    message: {
      content: string;
    }
  }];
}

class GroqTranslatorService {
  private apiKey: string;
  private baseUrl: string;
  private cache = new Map<string, string>();

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY;
    this.baseUrl = import.meta.env.VITE_GROQ_API_URL || 'https://api.groq.com/openai/v1/chat/completions';
    
    if (!this.apiKey) {
      console.error('❌ GROQ API key not found in environment variables');
      console.log('💡 Add VITE_GROQ_API_KEY to your .env file');
    }
  }

  async translate(text: string, fromLang: string = 'es', toLang: string = 'en'): Promise<string> {
    const cacheKey = `${text}-${fromLang}-${toLang}`;
    
    if (this.cache.has(cacheKey)) {
      console.log('✅ From cache:', text, '→', this.cache.get(cacheKey));
      return this.cache.get(cacheKey)!;
    }

    if (!this.apiKey) {
      throw new Error('GROQ API key not configured. Check your .env file.');
    }

    try {
      console.log('🤖 Translating with GROQ:', text);

      // Para términos muy cortos y específicos, usar fallback directo
      if (text.length <= 30) {
        const fallback = this.getFallbackTranslation(text);
        if (fallback !== text) {
          console.log('✅ Using direct fallback:', text, '→', fallback);
          this.cache.set(cacheKey, fallback);
          return fallback;
        }
      }

      // Prompt simple y directo
      const prompt = `Translate this Spanish bakery product name to English. Keep it short and simple:

Spanish: ${text}
English:`;

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-70b-8192',
          messages: [{
            role: 'user',
            content: prompt
          }],
          temperature: 0.1,
          max_tokens: 50 // Mucho más corto
        }),
      });

      if (!response.ok) {
        throw new Error(`GROQ API error: ${response.status}`);
      }

      const data: GroqResponse = await response.json();
      let translatedText = data.choices[0].message.content.trim();
      
      // Limpiar respuesta más agresivamente
      translatedText = translatedText
        .replace(/^["']|["']$/g, '')
        .replace(/^English:\s*/i, '')
        .replace(/^Translation:\s*/i, '')
        .replace(/\.$/, '')
        .split('\n')[0] // Solo la primera línea
        .trim();
      
      // Si es muy largo o contiene palabras sospechosas, usar fallback
      if (translatedText.length > 50 || 
          translatedText.includes('moist') || 
          translatedText.includes('topped') ||
          translatedText.includes('decorated') ||
          translatedText.includes('swirl') ||
          translatedText.toLowerCase().includes('magnificent') ||
          translatedText.toLowerCase().includes('exquisite')) {
        
        console.warn('⚠️ GROQ returned description instead of name, using fallback');
        translatedText = this.getFallbackTranslation(text);
      }
      
      console.log('✅ GROQ success:', text, '→', translatedText);

      this.cache.set(cacheKey, translatedText);
      this.saveToLocalStorage(cacheKey, translatedText);

      return translatedText;

    } catch (error) {
      console.error('❌ GROQ failed:', error);
      
      const fallback = this.getFallbackTranslation(text);
      console.log('🔄 Using fallback translation:', text, '→', fallback);
      return fallback;
    }
  }

  // Traducciones básicas de respaldo - EXPANDIDO
  private getFallbackTranslation(text: string): string {
    const basicTranslations: Record<string, string> = {
      // Productos principales
      'cupcake': 'cupcake',
      'cupcake de vainilla': 'vanilla cupcake',
      'cupcake de chocolate': 'chocolate cupcake',
      'cupcakes': 'cupcakes',
      'galletas': 'cookies',
      'galleta': 'cookie',
      'galletas de avena': 'oat cookies',
      'galletas de chocolate': 'chocolate cookies',
      'torta': 'cake',
      'tortas': 'cakes',
      'torta de chocolate': 'chocolate cake',
      'cheesecake': 'cheesecake',
      'pan': 'bread',
      'panes': 'breads',
      'pan francés': 'french bread',
      'pan artesanal': 'artisanal bread',
      'pasteles': 'pastries',
      'pastel': 'pastry',
      'croissant': 'croissant',
      'muffin': 'muffin',
      'muffins': 'muffins',
      'brownie': 'brownie',
      'brownies': 'brownies',
      
      // Sabores y ingredientes
      'vainilla': 'vanilla',
      'chocolate': 'chocolate',
      'fresa': 'strawberry',
      'limón': 'lemon',
      'naranja': 'orange',
      'café': 'coffee',
      'caramelo': 'caramel',
      'almendra': 'almond',
      'coco': 'coconut',
      'avena': 'oat',
      
      // Categorías comunes
      'postres': 'desserts',
      'postre': 'dessert',
      'dulces': 'sweets',
      'repostería': 'bakery',
      
      // Casos específicos problemáticos
      'cupicake': 'cupcake', // Typo común
      'tres leches': 'tres leches',
      'red velvet': 'red velvet'
    };

    const lowerText = text.toLowerCase().trim();
    
    // Buscar traducción exacta primero
    if (basicTranslations[lowerText]) {
      return basicTranslations[lowerText];
    }
    
    // Buscar coincidencias parciales manteniendo capitalización original
    for (const [spanish, english] of Object.entries(basicTranslations)) {
      if (lowerText.includes(spanish)) {
        // Mantener capitalización si está en título
        if (text[0] === text[0].toUpperCase()) {
          return english.charAt(0).toUpperCase() + english.slice(1);
        }
        return english;
      }
    }
    
    // Si no encuentra nada, devolver el original
    console.log('⚠️ No fallback found for:', text);
    return text;
  }

  private saveToLocalStorage(key: string, value: string) {
    try {
      const cache = JSON.parse(localStorage.getItem('groq-cache') || '{}');
      cache[key] = value;
      localStorage.setItem('groq-cache', JSON.stringify(cache));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  loadCache() {
    try {
      const cache = JSON.parse(localStorage.getItem('groq-cache') || '{}');
      Object.entries(cache).forEach(([key, value]) => {
        this.cache.set(key, value as string);
      });
      console.log('✅ Loaded cache:', this.cache.size, 'entries');
    } catch (e) {
      console.warn('Cache load failed:', e);
    }
  }

  async test() {
    console.log('🧪 Testing GROQ...');
    
    if (!this.apiKey) {
      console.error('❌ Cannot test: API key not configured');
      return 'API key not configured';
    }
    
    console.log('🔑 API key configured:', this.apiKey.substring(0, 10) + '...');
    
    try {
      const result = await this.translate('cupcake de chocolate');
      console.log('✅ Test successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Test failed:', error);
      throw error;
    }
  }

  checkConfig() {
    console.log('⚙️ GROQ Configuration:');
    console.log('API Key:', this.apiKey ? '✅ Configured' : '❌ Missing');
    console.log('Base URL:', this.baseUrl);
    console.log('Cache entries:', this.cache.size);
    
    return {
      apiKeyConfigured: !!this.apiKey,
      baseUrl: this.baseUrl,
      cacheSize: this.cache.size
    };
  }

  clearCache() {
    this.cache.clear();
    localStorage.removeItem('groq-cache');
    console.log('🗑️ Cache cleared');
  }

  // Limpiar traducciones problemáticas del cache
  cleanBadTranslations() {
    const badWords = ['magnificas', 'exquisitas', 'deliciosas tortas'];
    let cleaned = 0;
    
    this.cache.forEach((value, key) => {
      if (badWords.some(bad => value.toLowerCase().includes(bad))) {
        this.cache.delete(key);
        cleaned++;
      }
    });
    
    // También limpiar localStorage
    try {
      const cache = JSON.parse(localStorage.getItem('groq-cache') || '{}');
      Object.entries(cache).forEach(([key, value]) => {
        if (badWords.some(bad => (value as string).toLowerCase().includes(bad))) {
          delete cache[key];
        }
      });
      localStorage.setItem('groq-cache', JSON.stringify(cache));
    } catch (e) {
      console.warn('Failed to clean localStorage cache');
    }
    
    console.log(`🧹 Cleaned ${cleaned} bad translations from cache`);
  }
}

export const groqTranslator = new GroqTranslatorService();
groqTranslator.loadCache();

// Para testing en consola
(window as any).groq = {
  translate: (text: string) => groqTranslator.translate(text),
  test: () => groqTranslator.test(),
  config: () => groqTranslator.checkConfig(),
  clear: () => groqTranslator.clearCache(),
  clean: () => groqTranslator.cleanBadTranslations()
};

console.log('🤖 GROQ ready! Try: groq.config() or groq.test()');