import React from 'react'
import { Offering, TbDEXMessage } from '@tbd54566975/tbdex'
import { Record } from '@tbd54566975/web5/dist/types/record'
import currency from 'currency.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type RfqItemProps = {
  rfqMsg: TbDEXMessage<'rfq'>;
  quote?: Record;
  offering?: Offering;
};

export function RfqItem({ rfqMsg, quote, offering }: RfqItemProps) {
  const amount = currency(rfqMsg.body.quoteAmountSubunits, { fromCents: true }).value.toString()
  const baseCurrency = offering?.baseCurrency.currencyCode
  const quoteCurrency = offering?.quoteCurrency.currencyCode
  return (
    <li key={rfqMsg.id} className="relative flex gap-x-4">
      <div
        className={classNames(
          '-bottom-6',
          'absolute left-0 top-0 flex w-6 justify-center'
        )}
      >
        {quote && <div className="w-px bg-yellow-300" />}
      </div>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
        <div className="h-1.5 w-1.5 rounded-full bg-yellow-300 ring-1 ring-yellow-300" />
      </div>
      <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
        {'You requested '}
        <span className="font-medium text-gray-300">
          {baseCurrency}
        </span>
        {' for '}
        <span className="font-medium text-gray-300">{`${amount} ${quoteCurrency}`}</span>
        .
      </p>
      <div className="flex-none py-0.5 text-xs leading-5 text-gray-500">
        {dayjs(rfqMsg.createdTime).fromNow(true)} ago
      </div>
    </li>
  )
}
