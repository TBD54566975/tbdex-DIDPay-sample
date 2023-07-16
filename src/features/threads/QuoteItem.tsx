import React from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { Offering, TbDEXMessage } from '@tbd54566975/tbdex'
import { TbdexThread } from '../../utils/TbdexThread'
import { BTC, USD } from '../../utils/CurrencyUtils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type QuoteItemProps = {
  tbdexThread: TbdexThread;
};

export function QuoteItem(props: QuoteItemProps) {
  const yolo = false

  const quote = props.tbdexThread.quote
  // console.log(quote)
  if (!quote) return <></>

  const offering = props.tbdexThread.offering

  const baseCurrency = offering.baseCurrency.currencyCode
  const baseUnits = BTC(quote.message.body.base.amountSubunits).format()
  return (
    <li key={quote.message.id} className="relative flex gap-x-4">
      <div
        className={classNames(
          yolo ? 'h-6' : '-bottom-6',
          'absolute left-0 top-0 flex w-6 justify-center'
        )}
      >
        <div className="w-px bg-yellow-300" />
      </div>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
        {yolo ? (
          <CheckCircleIcon
            className="h-6 w-6 text-yellow-300"
            aria-hidden="true"
          />
        ) : (
          <div className="h-1.5 w-1.5 rounded-full bg-yellow-300 ring-1 ring-yellow-300" />
        )}
      </div>
      <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
        {'PFI offered '}
        <span className="font-medium text-gray-300">
          {baseUnits + ' ' + baseCurrency}
        </span>
        {/* {' '}
        for{' '}
        <span className="font-medium text-gray-300">
          {quoteUnits + ' ' + quoteCurrency}
        </span> */}
        .
      </p>
      <time
        dateTime={quote.message.createdTime}
        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
      >
        {dayjs(quote.message.createdTime).fromNow(true)} ago
      </time>
    </li>
  )
}
