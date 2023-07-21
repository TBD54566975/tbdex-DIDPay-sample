import React from 'react'
import { TbdexThread } from '../../tbdex-thread'
import { BTC, USD, getCurrencySymbol } from '../../utils/currency-utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

type QuoteCardProps = {
  tbdexThread: TbdexThread;
  onClick: () => void;
}

export function QuoteCard(props: QuoteCardProps) {
  const quote = props.tbdexThread.quote
  const offering = props.tbdexThread.offering

  const baseCurrency = offering.baseCurrency.currencyCode
  const baseUnits = BTC(quote.message.body.base.amountSubunits).format()
  const quoteCurrency = offering.quoteCurrency.currencyCode
  const quoteUnits = USD(quote.message.body.quote.amountSubunits).format()
  const currencySymbol = getCurrencySymbol(quoteCurrency)

  return (
    <div className="overflow-hidden bg-neutral-950 shadow rounded-lg pl-3 pr-3 pt-3 pb-3">

      <div className="lg:col-start-3 lg:row-end-1">
        <h2 className="sr-only">Summary</h2>
        <div className="rounded-lg bg-neutral-950 shadow-sm">
          <dl className="flex flex-wrap">
            <div className="flex-auto pl-6 pt-2 mt-1">
              <dt className="text-xs font-semibold leading-6 text-gray-500">You pay</dt>
              <dd className="mt-1 text-base font-semibold leading-6 text-gray-300">{quoteUnits} {quoteCurrency}</dd>
            </div>
            <div className="flex-auto pl-6 pt-2 mt-1">
              <dt className="text-xs font-semibold leading-6 text-gray-500">You get</dt>
              <dd className="mt-1 mb-3 text-base font-semibold leading-6 text-gray-300">{baseUnits} {baseCurrency}</dd>
            </div>
            <div className="mt-1 mb-3 flex w-full border-t border-gray-50/5 px-6 py-4">
              <p className="max-w-2xl text-xs leading-6 text-yellow-300">
                Expires in{' '}{dayjs(quote.message.body.expiryTime).fromNow(true)}
              </p>
            </div>
          </dl>
          
        </div>
      </div>

      <div className='flex justify-center'>
        <button
          type="submit"
          className="flex w-11/12 justify-center rounded-md bg-indigo-500 px-3 py-1.5 mb-6 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={props.onClick}
        >
          Pay {currencySymbol}{quoteUnits}
        </button>
      </div>
    </div>
  )
}
