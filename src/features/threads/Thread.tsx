import React, { useEffect, useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { RfqItem } from './RfqItem'
import { QuoteItem } from './QuoteItem'
import { OrderStatusItem } from './OrderStatusItem'
import { QuoteCard } from '../quotes/QuoteCard'
import { TbdexThread } from '../../utils/TbdexThread'

type ThreadProps = {
  tbdexThread: TbdexThread;
};

export function Thread(props: ThreadProps) {

  const handlePay = () => {
    const url = recordThread.quote?.body.paymentInstructions?.payin?.link || ''
    window.open(url, '_blank', 'noreferrer')
  }

  useEffect(() => {
    props.tbdexThread.startPolling()
  }, []) // state var can go here to restart the interval

  if (props.tbdexThread.close) {
    return <></>
  }

  return (
    <>
      <ul className="space-y-6">
        {props.tbdexThread.rfq && (
          <RfqItem
            rfq={recordThread.rfq}
            quote={recordThread.quote}
            offering={offering}
          />
        )}
        {recordThread.quote && (
          <QuoteItem quote={recordThread.quote} offering={offering} />
        )}
        {recordThread.orderStatuses.map((orderStatus, index) => (
          <OrderStatusItem
            key={orderStatus.id}
            id={orderStatus.id}
            index={index}
            lastIndex={recordThread.orderStatuses.length - 1}
          />
        ))}
      </ul>
      {recordThread.quote && recordThread.orderStatuses.length < 1 && (
        <div className="mt-6 flex gap-x-3">
          <ExclamationCircleIcon className="h-6 w-6 flex-none rounded-full text-yellow-300" />

          <div className="relative flex-auto rounded-md py-1 px-2 text-xs font-medium">
            <QuoteCard
              quote={recordThread.quote}
              offering={offering}
              onClick={handlePay}
            ></QuoteCard>
          </div>
        </div>
      )}
    </>
  )
}
