import React from 'react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { Offering, TbDEXMessage } from '@tbd54566975/tbdex'
import currency from 'currency.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type QuoteItemProps = {
  quoteMsg?: TbDEXMessage<'quote'>;
  offering?: Offering;
};

export function QuoteItem({ quoteMsg, offering }: QuoteItemProps) {
  const yolo = false
  const baseCurrency = offering?.baseCurrency.currencyCode
  const quoteCurrency = offering?.quoteCurrency.currencyCode
  const baseUnits = currency(quoteMsg?.body.base.amountSubunits).divide(100).value.toString()
  const quoteUnits = currency(quoteMsg?.body.quote.amountSubunits).divide(100).value.toString()
  return (
    <li key={quoteMsg?.id} className="relative flex gap-x-4">
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
        </span>{' '}
        for{' '}
        <span className="font-medium text-gray-300">
          {quoteUnits + ' ' + quoteCurrency}
        </span>
        .
      </p>
      <time
        dateTime={quoteMsg?.createdTime}
        className="flex-none py-0.5 text-xs leading-5 text-gray-500"
      >
        {dayjs(quoteMsg?.createdTime).fromNow(true)} ago
      </time>
    </li>
  )
}
