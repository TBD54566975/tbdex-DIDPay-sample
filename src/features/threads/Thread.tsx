import React, { useEffect, useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { Offering, TbDEXMessage } from '@tbd54566975/tbdex'
import { Record } from '@tbd54566975/web5/dist/types/record'
import { useWeb5Context } from '../../context/Web5Context'
import { getOfferingFromRfq, threadInit } from '../../utils/Web5Utils'
import { RfqItem } from './RfqItem'
import { QuoteItem } from './QuoteItem'
import { OrderStatusItem } from './OrderStatusItem'
import { QuoteCard } from '../quotes/QuoteCard'

export type RecordThread = {
  rfqRecord: Record;
  rfq?: TbDEXMessage<'rfq'>;
  quote?: TbDEXMessage<'quote'>;
  close?: TbDEXMessage<'close'>;
  orderStatuses: TbDEXMessage<'orderStatus'>[];
};

type ThreadProps = {
  props: RecordThread;
};

export function Thread({ props }: ThreadProps) {
  const [recordThread, setRecordThread] = useState<RecordThread>({
    rfqRecord: props.rfqRecord,
    rfq: props.rfq,
    orderStatuses: [],
  })
  const [offering, setOffering] = useState<Offering>()
  const { web5 } = useWeb5Context()

  const handlePay = () => {
    const url = recordThread.quote?.body.paymentInstructions?.payin?.link || ''
    window.open(url, '_blank', 'noreferrer')
  }

  // const interval = setInterval(async () => {
  //   console.log('before data json()')
  //   console.log((await recordThread.rfq?.data.json()) as TbDEXMessage<'rfq'>)
  //   console.log('after data json()')
  //   pollThread(
  //     web5,
  //     recordThread,
  //     setRecordThread,
  //     setOffering,
  //     setRfqMsg,
  //     setQuoteMsg,
  //     setCloseMsg,
  //     interval
  //   )
  // }, 5000)

  useEffect(() => {
    const rfqq = async () => {
      const offering = await getOfferingFromRfq(web5, recordThread.rfq)
      setOffering(offering)
      await threadInit(web5, recordThread, recordThread.rfq.to, setRecordThread)
    }
    
    rfqq()
      .then(() => {
        console.log('hi')
      })
      .catch(e => { console.log('ERROR womp womp', e) })

    // threadInit(web5, recordThread, setOffering, setRfqMsg);
    
  }, []) // state var can go here to restart the interval

  return !recordThread.rfq ? <></> : (
    <>
      <ul className="space-y-6">
        {recordThread.rfq && (
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
