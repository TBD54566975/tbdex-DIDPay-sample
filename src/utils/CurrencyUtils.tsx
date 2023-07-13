import currency from 'currency.js'

export const USD = value => currency(value, { symbol: '', fromCents: true })
export const BTC = value => currency(value, { symbol: '', precision: 8, fromCents: true})

export function getExchangeRate(quoteUnitsPerBaseUnit: string, baseCurrencyCode: string, quoteCurrencyCode: string) {
  return `1 ${baseCurrencyCode} / ${currency(quoteUnitsPerBaseUnit, { symbol: '' }).format()} ${quoteCurrencyCode}`
}

enum Currency {
  USD = '$',
  MXN = '$',
  GHA = '₵',
  BTC = '₿',
}
  
export function getCurrencySymbol(ticker: string): string {
  const currency = Currency[ticker as keyof typeof Currency]
  return currency || ''
}

export function getSubunits(quoteAmount: string) {
  return currency(quoteAmount).intValue.toString() 
}