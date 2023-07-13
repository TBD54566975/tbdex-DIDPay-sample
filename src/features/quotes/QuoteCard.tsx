import React from 'react'
import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { getPaymentInstructions } from '../../utils/TbdexUtils'
import { Offering, PaymentInstructions, TbDEXMessage } from '@tbd54566975/tbdex'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { BTC, USD, getCurrencySymbol } from '../../utils/CurrencyUtils'

dayjs.extend(relativeTime)

type QuoteCardProps = {
  quote?: TbDEXMessage<'quote'>;
  offering?: Offering;
  onClick: () => void;
};

//TODO: maybe get rid of the pending status when a quote comes back
export function QuoteCard(props: QuoteCardProps) {
  const baseCurrency = props.offering.baseCurrency.currencyCode
  const baseUnits = BTC(props.quote.body.base.amountSubunits).format()
  const quoteCurrency = props.offering.quoteCurrency.currencyCode
  const quoteUnits = USD(props.quote.body.quote.amountSubunits).format()
  const currencySymbol = getCurrencySymbol(quoteCurrency)

  return (
    <div className="overflow-hidden bg-neutral-950 shadow rounded-lg pl-3 pr-3 pt-3 pb-3">
      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <h3 className="text-xl font-semibold leading-7 text-gray-300">
              {quoteCurrency}
            </h3>
            <ArrowsRightLeftIcon className="h-5 w-5 text-gray-300 ml-1 mr-1" />
            <h3 className="text-xl font-semibold leading-7 text-gray-300">
              {baseCurrency}
            </h3>
          </div>
          <p className="max-w-2xl text-xs leading-6 text-yellow-300">
            Expires in{' '}
            {dayjs(props.quote.body.expiryTime).fromNow(true) ??
              'No description available'}
          </p>
        </div>
        {/* <div onClick={() => props.onClick()}>
          <div className="flex items-center">
            <div className="text-gray-600 text-xs">Details</div>
            <ChevronRightIcon
              className="h-5 w-5 flex-none text-gray-400 ml-1"
              aria-hidden="true"
            />
          </div>
        </div> */}
      </div>
      <div className="">
        <div className="mt-1 flex w-full border-t border-gray-50/5 px-6 mb-3"></div>
        <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-sm text-gray-500">You pay</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
            {quoteUnits} {quoteCurrency}
          </dd>
        </div>
        <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-sm text-gray-500">You get</dt>
          <dd className="mt-1 text-sm leading-6 text-gray-300 sm:col-span-2 sm:mt-0">
            {baseUnits} {baseCurrency}
          </dd>
        </div>
        <div className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt className="text-sm font-sm text-gray-500">Memo</dt>
          {getPaymentInstructions(props.quote.body.paymentInstructions) !== null ? (
            getPaymentInstructions(props.quote.body.paymentInstructions)
          ) : (
            <dd className="mt-1 text-sm text-gray-300 ">No additional instructions</dd>
          )}
        </div>
        <div className='flex justify-center'>
          <button
            type="submit"
            className="flex w-11/12 justify-center rounded-md bg-indigo-500 px-3 py-1.5 mt-6 mb-6 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={props.onClick}
          >
                Pay {currencySymbol}{quoteUnits}
          </button>
        </div>
       
      </div>
    </div>
  )
}
