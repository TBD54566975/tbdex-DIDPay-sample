import React, { useContext } from 'react'
import currency from 'currency.js'
import { CodeBracketIcon } from '@heroicons/react/20/solid'
import { RfqContext } from '../../../context/RfqContext'
import { shortenAddress } from '../../../utils/currency-utils'

type ReviewFormProps = {
  onSubmit: () => void;
  onBack: () => void;
}

export function ReviewForm(props: ReviewFormProps) {
  const {
    offering,
    baseAmount,
    quoteAmount,
    payoutDetails,
  } = useContext(RfqContext)

  const baseCurrency = offering?.baseCurrency.currencyCode
  const quoteUnits = currency(quoteAmount).format()
  const baseUnits = currency(baseAmount, { symbol: '', precision: 8}).format()
  const estPrice = currency(offering?.quoteUnitsPerBaseUnit).format()
  const btcAddress = shortenAddress(payoutDetails.btcAddress)

  const handleSubmit = () => {
    props.onSubmit()
  }

  const handleBack = () => {
    props.onBack()
  }

  return (
    <>
      <div className="lg:col-start-3 lg:row-end-1 ml-7 mr-7 mt-7 mb-7">
        <h2 className="sr-only">Summary</h2>
        <div className="rounded-lg bg-neutral-950 shadow-sm">
          <dl className="flex flex-wrap">
            <div className="flex-auto pl-6 pt-2 mt-1">
              <dt className="text-sm font-semibold leading-6 text-gray-500">You pay</dt>
              <dd className="mt-1 text-base font-semibold leading-6 text-gray-300">{quoteUnits}</dd>
            </div>
            <div className="flex-auto pl-6 pt-2 mt-1">
              <dt className="text-sm font-semibold leading-6 text-gray-500">You get</dt>
              <dd className="mt-1 mb-3 text-base font-semibold leading-6 text-gray-300">{baseUnits} {baseCurrency}</dd>
            </div>
            <div className="mt-1 flex w-full border-t border-gray-50/5 px-6 pt-4 pb-2">
              <p className="text-sm font-semibold leading-6 text-gray-500">
            Est BTC price: {estPrice} 
              </p>
            </div>
            <div className="mb-4 flex w-full flex-none gap-x-4 px-6">
              <dt className="flex-none">
                <CodeBracketIcon className="h-6 w-5 text-gray-500" aria-hidden="true" />
              </dt>
              <dd className="text-sm font-semibold leading-6 text-gray-500">{btcAddress}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="pl-8 pr-8 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-white"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  )
}
