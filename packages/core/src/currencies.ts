import type { CurrencyCode } from "./enums";

export const currencies: Record<CurrencyCode, { name: string; symbol: string }> = {
  NGN: {
    name: "Naira",
    symbol: "₦",
  },
  USD: {
    name: "Dollars",
    symbol: "$",
  },
  EUR: {
    name: "Euro",
    symbol: "€",
  },
  GBP: {
    name: "British Pound",
    symbol: "£",
  },
};

export const currencyCodes = Object.keys(currencies) as CurrencyCode[];
