import type { Currencies } from "./types";

export const currencies: Currencies = {
  NGN: {
    name: "Naira",
    code: "NGN",
    symbol: "₦",
  },
  USD: {
    name: "Dollars",
    code: "USD",
    symbol: "$",
  },
  EUR: {
    name: "Euro",
    code: "EUR",
    symbol: "€",
  },
  GBP: {
    name: "British Pound",
    code: "GBP",
    symbol: "£",
  },
};

export const currencyCodes = Object.values(currencies).map((v) => v.code);
