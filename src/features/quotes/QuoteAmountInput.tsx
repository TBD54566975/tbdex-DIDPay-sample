import React, { useContext, useState } from 'react'
import { RfqContext } from '../../context/RfqContext'
import { USD, getCurrencySymbol, convertToBaseUnits, formatUnits } from '../../utils/currency-utils'

type QuoteAmountInputProps = {
  currentQuoteAmount: string;
  currentBaseAmount: string;
  isWithinMinMax: (value: string) => boolean;
  setBaseAmount: (value: string) => void;
  setQuoteAmount: (value: string) => void;
}

export function QuoteAmountInput(props: QuoteAmountInputProps) {
  const { offering } = useContext(RfqContext)

  const [isAmountValid, setIsAmountValid] = useState(false)

  const minQuoteAmount = USD(offering.quoteCurrency.minSubunit)
  const maxQuoteAmount = USD(offering.quoteCurrency.maxSubunit)

  const handleQuoteAmountChange = (counterUnits: string) => {
    const formattedCounterUnits = formatUnits(counterUnits, 2)

    props.setQuoteAmount(formattedCounterUnits)
    props.setBaseAmount(convertToBaseUnits(formattedCounterUnits, offering.quoteUnitsPerBaseUnit))
    setIsAmountValid(props.isWithinMinMax(formattedCounterUnits))
  }

  return (
    <div>
      <label
        htmlFor="send"
        className="block text-sm font-medium leading-6 text-white"
      >
        {'Send'}
      </label>
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
      {props.currentQuoteAmount !== '' && isAmountValid ? (
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
