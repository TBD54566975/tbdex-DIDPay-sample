import React, { useEffect, useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Offering, TbDEXMessage } from '@tbd54566975/tbdex'
import { Record } from '@tbd54566975/web5/dist/types/record'
import { useWeb5Context } from '../../context/Web5Context'
import { pollThread } from '../../utils/Web5Utils'
import { RfqItem } from './RfqItem'
import { QuoteItem } from './QuoteItem'
import { OrderStatusItem } from './OrderStatusItem'
import { QuoteCard } from '../quotes/QuoteCard'

export type RecordThread = {
  rfq?: Record;
  quote?: Record;
  orderStatuses: Record[];
};

type ThreadProps = {
  props: RecordThread;
};

export function Thread({ props }: ThreadProps) {
  const [recordThread, setRecordThread] = useState<RecordThread>({
    rfq: props.rfq,
    orderStatuses: [],
  })
  const [offering, setOffering] = useState<Offering>()
  const [rfqMsg, setRfqMsg] = useState<TbDEXMessage<'rfq'>>()
  const [quoteMsg, setQuoteMsg] = useState<TbDEXMessage<'quote'>>()
  const { web5 } = useWeb5Context()

  const handlePay = () => {
    const url = quoteMsg?.body.paymentInstructions?.payin?.link || ''
    window.open(url, '_blank', 'noreferrer')
  }

  useEffect(() => {
    // threadInit(web5, recordThread, setOffering, setRfqMsg);
    const interval = setInterval(async () => {
      pollThread(
        web5,
        recordThread,
        setRecordThread,
        setOffering,
        setRfqMsg,
        setQuoteMsg,
        interval
      )
    }, 1000)
  }, []) // state var can go here to restart the interval

  return !rfqMsg ? null : (
    <>
      <ul className="space-y-6">
        {rfqMsg && (
          <RfqItem
            rfqMsg={rfqMsg}
            quote={recordThread.quote}
            offering={offering}
          />
        )}
        {recordThread.quote && (
          <QuoteItem quoteMsg={quoteMsg} offering={offering} />
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

          <div className="relative flex-auto rounded-md py-1 px-2 text-xs font-medium ring-1 ring-gray-300">
            <QuoteCard
              quoteMsg={quoteMsg}
              offering={offering}
              onClick={handlePay}
            ></QuoteCard>
          </div>
        </div>
      )}
    </>
  )
}
