import currency from 'currency.js'

// Enum representing different currency codes and their symbols.
enum Currency {
  USD = '$',
  MXN = '$',
  KES = 'KSh',
  BTC = '₿',
}

export const USD = value => currency(value, { symbol: '', fromCents: true })
export const BTC = value => currency(value, { symbol: '', precision: 8, fromCents: true})

/**
 * Gets the exchange rate between two currencies.
 * @param quoteUnitsPerBaseUnit - The exchange rate value.
 * @param baseCurrencyCode - The currency code of the base currency.
 * @param quoteCurrencyCode - The currency code of the quote currency.
 * @returns {string} - The formatted exchange rate string.
 */
export function getExchangeRate(quoteUnitsPerBaseUnit: string, baseCurrencyCode: string, quoteCurrencyCode: string) {
  return `1 ${baseCurrencyCode} / ${currency(quoteUnitsPerBaseUnit, { symbol: '' }).format()} ${quoteCurrencyCode}`
}

/**
 * Gets the currency symbol based on the currency code.
 * @param ticker - The currency code (ticker) of the currency.
 * @returns {string} - The currency symbol, or an empty string if not found.
 */
export function getCurrencySymbol(ticker: string): string {
  const currency = Currency[ticker as keyof typeof Currency]
  return currency || ''
}

/**
 * Gets the subunits of a currency amount (e.g. for USD, 10 units -> 1000 subunits).
 * @param quoteAmount - The amount in a particular currency.
 * @returns {string} - The amount in subunits.
 */
export function getSubunits(quoteAmount: string) {
  return currency(quoteAmount).intValue.toString() 
}

/**
 * Shortens a BTC address for display purposes.
 * @param address - The full BTC address.
 * @returns {string} - The shortened version of the address.
 */
export function shortenAddress(address) {
  const prefixLength = 6
  const suffixLength = 4
  
  if (!address || address.length <= prefixLength + suffixLength) {
    return address
  }
  
  const prefix = address.substring(0, prefixLength)
  const suffix = address.substring(address.length - suffixLength)
  
  const shortenedAddress = `${prefix}...${suffix}`
  
  return shortenedAddress
}

/**
 * Converts the given amount in counter units to its equivalent in base units.
 * @param counterUnits - The amount in counter units.
 * @param quoteUnitsPerBaseUnit - The exchange rate value.
 * @returns {string} - The converted amount in base units.
 */
export function convertToBaseUnits(counterUnits: string, quoteUnitsPerBaseUnit: string) {
  const parsedUnitPrice = parseFloat(
    quoteUnitsPerBaseUnit.replace(/,/g, '')
  )

  if (counterUnits !== '') {
    const baseUnits = (parseFloat(counterUnits) / parsedUnitPrice).toString()
    return baseUnits
  } else {
    return ''
  }
}

/**
 * Formats a numeric input with the specified decimal length.
 * @param input - The input value to be formatted.
 * @param decimalLength - The desired length of decimal digits.
 * @returns {string} - The formatted numeric string.
 */
export function formatUnits(input: string, decimalLength: number): string {
  // Remove any non-numeric and non-decimal characters except the first decimal point
  const numericValue = input.replace(/[^\d.]/g, (match, offset) => {
    if (match === '.') {
      // Allow the first decimal point
      return offset === 0 ? match : ''
    }
    return ''
  })

  // Remove additional decimal points if present
  const decimalIndex = numericValue.indexOf('.')
  if (decimalIndex !== -1) {
    const afterDecimal = numericValue.slice(decimalIndex + 1)
    const remainingDecimals = afterDecimal.slice(0, decimalLength)
    return `${numericValue.slice(0, decimalIndex)}.${remainingDecimals}`
  }

  return numericValue
}
  