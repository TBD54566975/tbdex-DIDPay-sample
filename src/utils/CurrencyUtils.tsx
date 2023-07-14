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

export function shortenAddress(address) {
  const prefixLength = 6 // Number of characters to keep from the beginning of the address
  const suffixLength = 4 // Number of characters to keep from the end of the address
  
  if (!address || address.length <= prefixLength + suffixLength) {
    return address // Return the original address if it is too short or invalid
  }
  
  const prefix = address.substring(0, prefixLength)
  const suffix = address.substring(address.length - suffixLength)
  
  const shortenedAddress = `${prefix}...${suffix}`
  
  return shortenedAddress
}
  