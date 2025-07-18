// src/utils/currency.ts
interface ExchangeRates {
  USD_TO_MXN: number;
}

// Tipo de cambio aproximado (en producción vendría de API)
const EXCHANGE_RATES: ExchangeRates = {
  USD_TO_MXN: 17.50 // 1 USD = 17.50 MXN (aproximado)
};

export const convertPrice = (usdPrice: number, targetCurrency: 'USD' | 'MXN'): number => {
  if (targetCurrency === 'USD') {
    return usdPrice;
  }
  
  // Convertir USD a MXN
  return Math.round(usdPrice * EXCHANGE_RATES.USD_TO_MXN);
};

export const formatPriceByLanguage = (usdPrice: number, language: string): string => {
  if (language === 'en') {
    // Inglés: mostrar USD
    return `${usdPrice.toFixed(2)} USD`;
  } else {
    // Español: mostrar MXN
    const mxnPrice = convertPrice(usdPrice, 'MXN');
    return `${mxnPrice.toLocaleString('es-MX')} MXN`;
  }
};

// Función de respaldo (mantener compatibilidad)
export const formatPrice = (price: number, currency: 'USD' | 'MXN' = 'MXN'): string => {
  const convertedPrice = convertPrice(price, currency);
  
  if (currency === 'USD') {
    return `${convertedPrice.toFixed(2)} USD`;
  }
  
  return `${convertedPrice.toLocaleString('es-MX')} MXN`;
};

// Para testing
export const testCurrency = () => {
  console.log('💱 Currency conversion tests:');
  console.log('EN: $25 USD →', formatPriceByLanguage(25, 'en'));
  console.log('ES: $25 USD →', formatPriceByLanguage(25, 'es'));
  console.log('EN: $3.50 USD →', formatPriceByLanguage(3.50, 'en'));
  console.log('ES: $3.50 USD →', formatPriceByLanguage(3.50, 'es'));
  console.log('ES: $120 USD →', formatPriceByLanguage(120, 'es'));
};

// Hacer función disponible globalmente para testing
(window as any).testCurrency = testCurrency;