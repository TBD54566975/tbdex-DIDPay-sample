import React, { useContext, useState } from 'react'
import { QuoteAmountInput } from '../../quotes/QuoteAmountInput'
import { RfqContext } from '../../../context/RfqContext'
import { USD } from '../../../utils/currency-utils'

type SelectAmountFormProps = {
  onNext: () => void;
}

export function SetQuoteAmountForm(props: SelectAmountFormProps) {
  const { offering, baseAmount, setBaseAmount, quoteAmount, setQuoteAmount} = useContext(RfqContext)

  const minQuoteUnits = USD(offering.quoteCurrency.minSubunit).value
  const maxQuoteUnits = USD(offering.quoteCurrency.maxSubunit).value

  const [currentQuoteAmount, setCurrentQuoteAmount] = useState(quoteAmount)
  const [currentBaseAmount, setCurrentBaseAmount] = useState(baseAmount)

  const isWithinMinMax = (value: string) => {
    const parsedAmount = parseFloat(value)  
    if (parsedAmount > minQuoteUnits && parsedAmount < maxQuoteUnits) {
      return true
    }
    return false
  }

  const handleNext = () => {
    const parsedAmount = parseFloat(currentQuoteAmount)
    if (isNaN(parsedAmount)) {
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
          <QuoteAmountInput
            currentQuoteAmount={currentQuoteAmount}
            currentBaseAmount={currentBaseAmount}
            isWithinMinMax={isWithinMinMax}
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
