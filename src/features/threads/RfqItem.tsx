import React from 'react'
import { TbdexThread } from '../../utils/TbdexThread'
import { USD } from '../../utils/CurrencyUtils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type RfqItemProps = {
  tbdexThread: TbdexThread;
};

export function RfqItem(props: RfqItemProps) {
  const rfq = props.tbdexThread.rfq
  const offering = props.tbdexThread.offering
  if (!rfq || !offering) return <></>


  const quoteAmount = USD(rfq.message.body.quoteAmountSubunits).format()
  const baseCurrency = offering.baseCurrency.currencyCode
  const quoteCurrency = offering.quoteCurrency.currencyCode
  return (
    <li key={rfq.message.id} className="relative flex gap-x-4">
      <div
        className={classNames(
          '-bottom-6',
          'absolute left-0 top-0 flex w-6 justify-center'
        )}
      >
        {props.tbdexThread.quote && <div className="w-px bg-yellow-300" />}
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