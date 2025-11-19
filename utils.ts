import { CurrencyCode, DEFAULT_CURRENCIES } from './types';

export const formatCurrency = (amount: number, code: CurrencyCode): string => {
  const currency = DEFAULT_CURRENCIES[code];
  
  // JPY and KRW typically don't have decimal places in common business usage
  const maxDecimals = (code === CurrencyCode.KRW || code === CurrencyCode.JPY) ? 0 : 2;

  return new Intl.NumberFormat(currency.locale, {
    style: 'decimal',
    minimumFractionDigits: maxDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(amount);
};

export const calculateTotals = (items: { qty: number; unitPrice: number }[], vatRate: number, otherCosts: number) => {
  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0);
  const vatAmount = subtotal * (vatRate / 100);
  const grandTotal = subtotal + vatAmount + otherCosts;

  return { subtotal, vatAmount, grandTotal };
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};