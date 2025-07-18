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
            content: `Translate this bakery product text from Spanish to English. Only return the translation:

"${text}"`
          }],
          temperature: 0.2,
          max_tokens: 100
        }),
      });

      if (!response.ok) {
        throw new Error(`GROQ API error: ${response.status}`);
      }

      const data: GroqResponse = await response.json();
      const translatedText = data.choices[0].message.content.trim();
      
      console.log('✅ GROQ success:', text, '→', translatedText);

      this.cache.set(cacheKey, translatedText);
      this.saveToLocalStorage(cacheKey, translatedText);

      return translatedText;

    } catch (error) {
      console.error('❌ GROQ failed:', error);
      throw error;
    }
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
      const result = await this.translate('Cupcake de chocolate delicioso');
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
}

export const groqTranslator = new GroqTranslatorService();
groqTranslator.loadCache();

(window as any).groq = {
  translate: (text: string) => groqTranslator.translate(text),
  test: () => groqTranslator.test(),
  config: () => groqTranslator.checkConfig(),
  clear: () => groqTranslator.clearCache()
};

console.log('🤖 GROQ ready! Try: groq.config() or groq.test()');
