// src/utils/currency.ts
interface ExchangeRates {
  USD_TO_MXN: number;
}

const EXCHANGE_RATES: ExchangeRates = {
  USD_TO_MXN: 17.50
};

export const convertPrice = (usdPrice: number, targetCurrency: 'USD' | 'MXN'): number => {
  if (targetCurrency === 'USD') {
    return usdPrice;
  }
  return Math.round(usdPrice * EXCHANGE_RATES.USD_TO_MXN);
};

export const formatPriceByLanguage = (usdPrice: number, language: string): string => {
  if (language === 'en') {
    return `$${usdPrice.toFixed(2)} USD`;
  } else {
    const mxnPrice = convertPrice(usdPrice, 'MXN');
    const formattedPrice = mxnPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `$${formattedPrice} MXN`;
  }
};

export const testCurrency = () => {
  console.log('💱 Currency conversion tests:');
  console.log('EN: $25 USD →', formatPriceByLanguage(25, 'en'));
  console.log('ES: $25 USD →', formatPriceByLanguage(25, 'es'));
  console.log('EN: $3.50 USD →', formatPriceByLanguage(3.50, 'en'));
  console.log('ES: $3.50 USD →', formatPriceByLanguage(3.50, 'es'));
  console.log('ES: $120 USD →', formatPriceByLanguage(120, 'es'));
};

(window as any).testCurrency = testCurrency;
