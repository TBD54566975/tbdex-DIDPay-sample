import React, { Fragment, useContext, useState } from 'react'
import { BTC, USD, getCurrencySymbol } from '../../utils/CurrencyUtils'
import { RfqContext } from '../../context/RfqContext'

type ExchangeFormProps = {
  onNext: () => void;
};

export function SelectAmountForm(props: ExchangeFormProps) {
  const { offering, baseAmount, setBaseAmount, quoteAmount, setQuoteAmount} = useContext(RfqContext)

  const minQuoteUnits = USD(offering.quoteCurrency.minSubunit).value
  const maxQuoteUnits = USD(offering.quoteCurrency.maxSubunit).value

  const [currentQuoteAmount, setCurrentQuoteAmount] = useState(quoteAmount)
  const [currentBaseAmount, setCurrentBaseAmount] = useState(baseAmount)

  const handleNext = () => {
    const parsedAmount = parseFloat(currentQuoteAmount)
    if (isNaN(parsedAmount)) {
      // Return or handle the case when the amount is not a valid number
      return
    }

    const isAmountOutsideRange = parsedAmount < minQuoteUnits || parsedAmount > maxQuoteUnits
    if (!isAmountOutsideRange) {
      setQuoteAmount(currentQuoteAmount)
      setBaseAmount(currentBaseAmount)
      props.onNext()
    }
  }

  return (
    <>
      <div className="mt-8 mb-8 pl-8 pr-8">
        <div className="mt-8">
          <PriceInput
            currentQuoteAmount={currentQuoteAmount}
            currentBaseAmount={currentBaseAmount}
            setBaseAmount={setCurrentBaseAmount}
            setQuoteAmount={setCurrentQuoteAmount}
          />{' '}
        </div>
      </div>
      <div className="mt-12 pl-8 pr-8 flex items-center justify-end gap-x-6">
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </>
  )
}

type PriceInputProps = {
  currentQuoteAmount: string;
  currentBaseAmount: string;
  setBaseAmount: (newValue: string) => void;
  setQuoteAmount: (newValue: string) => void;
};

function PriceInput(props: PriceInputProps) {
  // Extracting base currency and counter currency from the pair
  const [isAmountOutsideRange, setIsAmountOutsideRange] = useState(false)
  const { offering, baseAmount } = useContext(RfqContext)
  
  const minQuoteAmount = USD(offering.quoteCurrency.minSubunit)
  const maxQuoteAmount = USD(offering.quoteCurrency.maxSubunit)
  const parsedUnitPrice = parseFloat(
    offering.quoteUnitsPerBaseUnit.replace(/,/g, '')
  )

  function convertToBaseUnits(counterUnits: string) {
    if (counterUnits !== '') {
      const parsedCounterUnits = parseFloat(counterUnits)
      const baseUnits = (parsedCounterUnits / parsedUnitPrice).toString()
      // props.setBaseAmount(formatUnits(baseUnits, 8))
      return baseUnits
    } else {
      return ''
    }
  }

  // TODO: this doesnt support decimals properly
  function formatUnits(input: string, decimalLength: number): string {
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

  const handleQuoteAmountChange = (counterUnits: string) => {
    const formattedCounterUnits = formatUnits(counterUnits, 2)
    props.setQuoteAmount(formattedCounterUnits)
    props.setBaseAmount(convertToBaseUnits(formattedCounterUnits))

    const parsedAmount = parseFloat(formattedCounterUnits)
    setIsAmountOutsideRange(
      parsedAmount < minQuoteAmount.value || parsedAmount > maxQuoteAmount.value
    )
  }

  return (
    <div>
      <label
        htmlFor="send"
        className="block text-sm font-medium leading-6 text-white"
      >
        {'Send'}
      </label>
      {/* First Price Input */}
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">
            {getCurrencySymbol(offering.quoteCurrency.currencyCode)}
          </span>
        </div>
        <input
          type="text"
          name="send"
          id="send"
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-white bg-neutral-900 ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="0.00"
          aria-describedby="price-currency"
          value={props.currentQuoteAmount}
          onChange={(e) => handleQuoteAmountChange(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            {offering.quoteCurrency.currencyCode}
          </span>
        </div>
      </div>
      {props.currentQuoteAmount !== '' && isAmountOutsideRange ? (
        <p className="mt-2 text-sm text-red-600" id="email-error">
          {parseFloat(props.currentQuoteAmount) < minQuoteAmount.value
            ? `Minimum order is ${minQuoteAmount.format()}`
            : parseFloat(props.currentQuoteAmount) > maxQuoteAmount.value
              ? `Maximum order is 
              ${maxQuoteAmount.format()}`
              : null}
        </p>
      ) : null}
      <label
        htmlFor="receive"
        className="block text-sm font-medium leading-6 text-white mt-5"
      >
        {'Receive'}
      </label>{' '}
      {/* Second Price Input */}
      <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">
            {getCurrencySymbol(offering.baseCurrency.currencyCode)}
          </span>
        </div>
        <input
          type="text"
          name="receive"
          id="receive"
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-white bg-neutral-900 ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="0.00"
          aria-describedby="price-currency"
          value={formatUnits(props.currentBaseAmount, 8)}
          readOnly
          // onChange={(e) => props.onChange(e.target.value)}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm" id="price-currency">
            {offering.baseCurrency.currencyCode}
          </span>
        </div>
      </div>
    </div>
  )
}
