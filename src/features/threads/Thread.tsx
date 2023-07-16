import React, { useEffect, useMemo, useState } from 'react'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'
import { RfqItem } from './RfqItem'
import { QuoteItem } from './QuoteItem'
import { OrderStatusItem } from './OrderStatusItem'
import { QuoteCard } from '../quotes/QuoteCard'
import { TbdexThread, MessageRecordMap } from '../../utils/TbdexThread'

type ThreadProps = { 
  tbdexThread: TbdexThread 
};

export function Thread(props: ThreadProps) {
  const [messageRecordMap, setMessageRecordMap] = useState<MessageRecordMap>(props.tbdexThread.messageRecordMap)
  const [seenRecords, setSeenRecords] = useState<Set<string>>(props.tbdexThread.seenRecords)

  // TODO: quote only updates after second poll 
  const quote = props.tbdexThread.quote
  const orderStatuses = props.tbdexThread.orderStatuses


  const handlePay = () => {
    const url = props.tbdexThread.quote.message.body.paymentInstructions?.payin?.link || ''
    window.open(url, '_blank', 'noreferrer')
  }

  /**
   * Updates the message record map and seen records of the TbdexThread.
   * This function is called to update the state and trigger a rerender.
   *
   * @param {Map<string, TbdexMessageRecord[]>} map - The updated message record map.
   * @param {Set<string>} set - The updated set of seen records.
   */
  const updateThread = (map, set) => {
    setMessageRecordMap(new Map([...map]))
    props.tbdexThread.messageRecordMap = messageRecordMap
    setSeenRecords(new Set([...set]))
    props.tbdexThread.seenRecords = seenRecords
  }

  useEffect(() => {
    props.tbdexThread.startPolling(updateThread)

    // props.tbdexThread.on('quote', (record: any, tbdexMessage: any) => {
    //   console.log('got a quote!', JSON.stringify(tbdexMessage, null, 2))
    // }, updateThread)
  }, [messageRecordMap, seenRecords]) // state var can go here to restart the interval

  if (props.tbdexThread.close) {
    return <></>
  }

  return (
    <>
      <ul className="space-y-6">
        <RfqItem tbdexThread={props.tbdexThread} />
        <QuoteItem tbdexThread={props.tbdexThread} />        
        {/* {recordThread.orderStatuses.map((orderStatus, index) => (
          <OrderStatusItem
            key={orderStatus.id}
            id={orderStatus.id}
            index={index}
            lastIndex={recordThread.orderStatuses.length - 1}
          />
        ))} */}
      </ul>
      {quote && orderStatuses.length < 1 && (
        <div className="mt-6 flex gap-x-3">
          <ExclamationCircleIcon className="h-6 w-6 flex-none rounded-full text-yellow-300" />
          <div className="relative flex-auto rounded-md py-1 px-2 text-xs font-medium">
            <QuoteCard tbdexThread={props.tbdexThread} onClick={handlePay} />
          </div>
        </div>
      )}
    </>
  )
}
