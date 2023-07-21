import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { classNames } from '../../utils/tailwind-utils'
import { TbdexThread } from '../../tbdex-thread'
import { USD } from '../../utils/currency-utils'

dayjs.extend(relativeTime)

type RfqItemProps = {
  tbdexThread: TbdexThread
}

export function RfqItem(props: RfqItemProps) {
  const rfq = props.tbdexThread.rfq
  const quote = props.tbdexThread.quote
  const offering = props.tbdexThread.offering

  if (!rfq || !offering) return <></>

  const quoteAmount = USD(rfq.message.body.quoteAmountSubunits).format()
  const baseCurrency = offering.baseCurrency.currencyCode
  const quoteCurrency = offering.quoteCurrency.currencyCode
  
  return (
    <li key={rfq.message.id} className="relative flex gap-x-4">
      <div
        className={classNames(
          quote ? '-bottom-6' : 'h-6',
          'absolute left-0 top-0 flex w-6 justify-center'
        )}
      >
        <div className="w-px bg-yellow-300" />
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
        <span className="font-medium text-gray-300">{`${quoteAmount} ${quoteCurrency}`}</span>
        .
      </p>
      <div className="flex-none py-0.5 text-xs leading-5 text-gray-500">
        {dayjs(rfq.message.createdTime).fromNow(true)} ago
      </div>
    </li>
  )
}
