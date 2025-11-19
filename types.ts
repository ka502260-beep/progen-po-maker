export enum CurrencyCode {
  USD = 'USD',
  KRW = 'KRW',
  EUR = 'EUR',
  JPY = 'JPY',
  CNY = 'CNY'
}

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  locale: string;
}

export interface LineItem {
  id: string;
  name: string;
  spec: string;
  qty: number;
  unitPrice: number;
  remarks: string;
}

export interface PurchaseOrder {
  poNumber: string;
  date: string;
  deliveryDate: string;
  supplier: string;
  buyer: string;
  currency: CurrencyCode;
  items: LineItem[];
  vatRate: number; // Percentage
  otherCosts: number;
  terms: string;
}

export const DEFAULT_CURRENCIES: Record<CurrencyCode, Currency> = {
  [CurrencyCode.USD]: { code: CurrencyCode.USD, symbol: '$', locale: 'en-US' },
  [CurrencyCode.KRW]: { code: CurrencyCode.KRW, symbol: '₩', locale: 'ko-KR' },
  [CurrencyCode.EUR]: { code: CurrencyCode.EUR, symbol: '€', locale: 'de-DE' },
  [CurrencyCode.JPY]: { code: CurrencyCode.JPY, symbol: '¥', locale: 'ja-JP' },
  [CurrencyCode.CNY]: { code: CurrencyCode.CNY, symbol: '¥', locale: 'zh-CN' },
};