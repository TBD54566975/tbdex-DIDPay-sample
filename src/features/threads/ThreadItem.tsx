import React, { useEffect, useState } from 'react'
import { RfqItem } from './RfqItem'
import { QuoteItem } from './QuoteItem'
import { OrderStatusItem } from './OrderStatusItem'
import { TbdexThread, MessageRecordMap } from '../../tbdex-thread'

type ThreadItemProps = { 
  tbdexThread: TbdexThread 
}

export function ThreadItem(props: ThreadItemProps) {
  const [messageRecordMap, setMessageRecordMap] = useState<MessageRecordMap>(props.tbdexThread.messageRecordMap)
  const [seenRecords, setSeenRecords] = useState<Set<string>>(props.tbdexThread.seenRecords)

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
  }, [messageRecordMap, seenRecords]) // state var can go here to restart the interval

  if (props.tbdexThread.close) {
    return <></>
  }

  return (
    <>
      <ul className="space-y-6">
        <RfqItem tbdexThread={props.tbdexThread} />
        <QuoteItem tbdexThread={props.tbdexThread} />
        <OrderStatusItem tbdexThread = {props.tbdexThread} />
      </ul>
    </>
  )
}
