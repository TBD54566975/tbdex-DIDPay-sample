import React from 'react'
import { Status } from '@tbd54566975/tbdex'
import { QuoteCard } from '../quotes/QuoteCard'
import { TbdexThread } from '../../utils/TbdexThread'
import { BTC } from '../../utils/CurrencyUtils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type QuoteItemProps = {
  tbdexThread: TbdexThread
}

export function QuoteItem(props: QuoteItemProps) {
  const quote = props.tbdexThread.quote
  const orderStatuses = props.tbdexThread.orderStatuses
  const offering = props.tbdexThread.offering

  if (!quote) return <></>

  const baseCurrency = offering.baseCurrency.currencyCode
  const baseUnits = BTC(quote.message.body.base.amountSubunits).format()

  const handlePay = () => {
    const url = props.tbdexThread.quote.message.body.paymentInstructions?.payin?.link || ''
    window.open(url, '_blank', 'noreferrer')
  }
  const hasPaymentInitiated = props.tbdexThread.orderStatuses.some(
    (orderStatus) => orderStatus.message.body.orderStatus === Status.PAYIN_INITIATED
  )
  
  return (
    <li key={quote.message.id} className="relative flex gap-x-4">
      <div
        className={classNames(
          orderStatuses.length > 0 ? '-bottom-6' : 'h-6',
          'absolute left-0 top-0 flex w-6 justify-center'
        )}
      >
        <div className="w-px bg-yellow-300" />
      </div>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
        <div className="h-1.5 w-1.5 rounded-full bg-yellow-300 ring-1 ring-yellow-300" />
      </div>

      <div className="flex flex-col">
        <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
          {'PFI offered '}
          <span className="font-medium text-gray-300">
            {baseUnits + ' ' + baseCurrency}
          </span>
          .
        </p>
        
        {!hasPaymentInitiated && (
          <div className="mt-6 flex gap-x-3">
            <div className="relative flex-auto rounded-md py-1 px-2 text-xs font-medium">
              <QuoteCard tbdexThread={props.tbdexThread} onClick={handlePay} />
            </div>
          </div>
        )}
      </div>
      <div className="flex-none ml-auto py-0.5 text-xs leading-5 text-gray-500">
      {dayjs(quote.message.createdTime).fromNow(true)} ago
    </div>
    </li>
  )
  
}
