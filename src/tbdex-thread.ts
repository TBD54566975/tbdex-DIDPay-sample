import { Web5 } from '@tbd54566975/web5'
import { DateSort } from '@tbd54566975/dwn-sdk-js'
import { TbDEXMessage, Offering } from '@tbd54566975/tbdex'

type ThreadEventTypes = 'quote' | 'close' | 'orderStatus'
type EventCallback = (record: any, tbdexMessage: any) => Promise<void> | void
export type TbdexMessageRecord = {
  record: any
  message: any
  messageType: string
}

export type MessageRecordMap = Map<string, TbdexMessageRecord[]>

export class TbdexThread {
  web5: Web5
  contextId: string
  pfiDid: string
  messageRecordMap: MessageRecordMap
  offering: Offering
  seenRecords: Set<string>
  listeners: { [event: string]: EventCallback }
  intervalId: NodeJS.Timer

  static async getOfferingFromRfq(web5: Web5, rfqMsg: TbDEXMessage<'rfq'>) {
    const { records = [], status } = await web5.dwn.records.query({
      from: rfqMsg.to,
      message: {
        filter: {
          schema: 'https://tbd.website/resources/tbdex/Offering',
        },
      },
    })

    if (status.code !== 200) {
      throw new Error(`Failed to get offering from PFI. Error: ${JSON.stringify(status, null, 2)}`)
    }
  
    for (const record of records) {
      const offering = await record.data.json()
      if (offering.id === rfqMsg.body.offeringId) {
        return offering
      }
    }
  }

  static async fetch(web5: Web5, dwnContextId: string) {
    const { records = [], status } = await web5.dwn.records.query({
      message: {
        filter: {
          contextId: dwnContextId
        },
        dateSort: DateSort.CreatedAscending
      }
    })

    if (status.code !== 200) {
      throw new Error(`Failed to get tbdex thread (contextId: ${dwnContextId}). Error: ${JSON.stringify(status, null, 2)}`)
    }

    const messageRecordMap: MessageRecordMap = new Map()
    
    for (const record of records) {
      const message = await record.data.json()
      const messageType = message['type']
      const tbdexMessageRecord: TbdexMessageRecord = { record,  message, messageType }

      if (messageRecordMap.has(messageType)) {
        const list = messageRecordMap.get(messageType)
        list.push(tbdexMessageRecord)
      } else {
        messageRecordMap.set(messageType, [tbdexMessageRecord])
      }
    }

    const rfq: TbDEXMessage<'rfq'> = messageRecordMap.get('rfq')[0].message
    const offering = await TbdexThread.getOfferingFromRfq(web5, rfq)

    return new TbdexThread(web5, dwnContextId, rfq.to, messageRecordMap, offering)
  }

  constructor(web5: Web5, contextId: string, pfiDid: string, messageRecordMap: MessageRecordMap, offering: Offering, listeners?: { [event: string]: EventCallback }, intervalId?: NodeJS.Timer) {
    this.web5 = web5
    this.contextId = contextId
    this.pfiDid = pfiDid
    this.messageRecordMap = messageRecordMap
    this.offering = offering
    this.listeners = {}
    this.seenRecords = new Set([])

    const messageRecordMapValues = Array.from(messageRecordMap.values())
    for (const messageRecords of messageRecordMapValues) {      
      for (const messageRecord of messageRecords) {
        const recordId = messageRecord.record.id
        this.seenRecords.add(recordId)
      }
    }
  }

  get rfq() {
    return this.messageRecordMap.get('rfq')?.[0] ?? undefined
  }

  get quote() {
    return this.messageRecordMap.get('quote')?.[0] ?? undefined
  }

  get close() {
    return this.messageRecordMap.get('close')?.[0] ?? undefined
  }

  get orderStatuses() {
    return this.messageRecordMap.get('orderStatus') || []
  }

  get currentOrderStatus() {
    const orderStatuses = this.orderStatuses

    return orderStatuses[orderStatuses.length - 1]
  }

  isDone() {
    if (this.close) {
      return true
    }

    const currentOrderStatus = this.currentOrderStatus
    // TODO: figure out what the terminal order statuses are
  }

  on(event: ThreadEventTypes, cb: EventCallback, updateThread: any) {
    if (!this.intervalId) {
      this.startPolling(updateThread)
    }

    this.listeners[event] = cb
  }

  stop() {
    clearInterval(this.intervalId)
    this.intervalId = null
  }

  startPolling(updateThread) {
    this.intervalId = setInterval(async () => {
      const { records, status } = await this.web5.dwn.records.query({
        from    : this.pfiDid,
        message : {
          filter: { contextId: this.contextId }
        }
      })

      if (status.code !== 200) {
        throw new Error(`failed to query dwn for tbdex messages. Error: ${JSON.stringify(status, null, 2)}`)
      }

      for (const record of records) {
        if (this.seenRecords.has(record.id)) {
          continue
        }
        this.seenRecords.add(record.id)

        const tbdexMessage = await record.data.json()

        const messageType = tbdexMessage['type']
        const tbdexMessageRecord: TbdexMessageRecord = { message: tbdexMessage, messageType: messageType, record: record }

        if (this.messageRecordMap.has(messageType)) {
          const list = this.messageRecordMap.get(messageType)
          list.push(tbdexMessageRecord)
        } else {
          this.messageRecordMap.set(messageType, [tbdexMessageRecord])
        }
        updateThread(this.messageRecordMap, this.seenRecords)

        const listener = this.listeners[messageType]

        if (listener) {
          await listener(record, tbdexMessage)
        }
      }
      
    }, 3_000)
  }
}
