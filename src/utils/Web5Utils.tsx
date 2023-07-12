import {
  aliceProtocolDefinition,
  createMessage,
  Offering,
  PaymentMethodKind,
  Rfq,
  TbDEXMessage,
} from '@tbd54566975/tbdex'
import { Web5 } from '@tbd54566975/web5'
import currency from 'currency.js'
import { RecordThread } from '../features/threads/Thread'
import { Record } from '@tbd54566975/web5/dist/types/record'

/**
 * queries DWN for VCs
 * @returns an array of VCs
 */
export async function getVcs(web5: Web5) {
  const { records = [], status } = await web5.dwn.records.query({
    message: {
      filter: {
        schema: 'https://www.w3.org/2018/credentials/v1',
      },
    },
  })

  if (status.code !== 200) {
    throw new Error('Failed to fetch VCs')
  }

  const vcs = []
  for (const record of records) {
    const vc = await record.data.text()
    console.log(vc)
    vcs.push(vc)
  }

  return vcs
}

export async function getThreads(web5: Web5) {
  const threads: { [key: string]: RecordThread } = {}

  const { records = [] } = await web5.dwn.records.query({
    message: {
      filter: {
        schema: aliceProtocolDefinition.types.RFQ.schema,
      },
    },
  })

  for (const record of records) {
    const rfqMsg = (await record.data.json()) as TbDEXMessage<'rfq'>
    if (rfqMsg.type === 'rfq') {
      const threadId = rfqMsg.threadId
      threads[threadId] = { rfq: record, orderStatuses: [] }
    }
  }
  return threads
}

export async function getOfferings(web5: Web5, pfiDid: string) {
  const { records = [] } = await web5.dwn.records.query({
    from: pfiDid,
    message: {
      filter: {
        schema: 'https://tbd.website/resources/tbdex/Offering',
      },
    },
  })

  const offerings = []
  for (const record of records) {
    const offering = await record.data.json()
    offerings.push(offering)
  }

  return offerings
}

export async function getChildRecords(
  web5: Web5,
  pfiDid: string,
  record: any
): Promise<Array<any> | void> {
  if (record.id) {
    try {
      const { records } = await web5.dwn.records.query({
        from: pfiDid,
        message: {
          filter: {
            parentId: record.id,
          },
        },
      })

      if (records) {
        return records
      }
    } catch (error) {
      // console.log('No child for record: ' + record.id);
    }
  }
  return undefined
}

async function getRfqOffering(web5: Web5, pfiDid: string, offeringId: string) {
  try {
    const { records = [] } = await web5.dwn.records.query({
      from: pfiDid,
      message: {
        filter: {
          schema: 'https://tbd.website/resources/tbdex/Offering',
        },
      },
    })

    for (const record of records) {
      const offering = await record.data.json()
      if (offering.id === offeringId) {
        return offering
      }
    }
  } catch (error) {
    console.log('FIX ME')
  }
}

export const threadInit = async (
  web5: Web5,
  recordThread: RecordThread,
  setOffering: React.Dispatch<React.SetStateAction<Offering | undefined>>,
  setRfqMsg: React.Dispatch<
    React.SetStateAction<TbDEXMessage<'rfq'> | undefined>
  >
) => {
  const rfqMsg = (await recordThread.rfq?.data.json()) as TbDEXMessage<'rfq'>
  setRfqMsg(rfqMsg)

  const offering = await getRfqOffering(
    web5,
    rfqMsg.to,
    rfqMsg.body.offeringId
  )
  setOffering(offering)
}

export const pollThread = async (
  web5: Web5,
  recordThread: RecordThread,
  setRecordThread: React.Dispatch<React.SetStateAction<RecordThread>>,
  setOffering: React.Dispatch<React.SetStateAction<Offering | undefined>>,
  setRfqMsg: React.Dispatch<
    React.SetStateAction<TbDEXMessage<'rfq'> | undefined>
  >,
  setQuoteMsg: React.Dispatch<
    React.SetStateAction<TbDEXMessage<'quote'> | undefined>
  >,
  interval: NodeJS.Timer
) => {
  // TODO: take out of pollThread
  const rfqMsg = (await recordThread.rfq?.data.json()) as TbDEXMessage<'rfq'>
  setRfqMsg(rfqMsg)

  const offering = await getRfqOffering(
    web5,
    rfqMsg.to,
    rfqMsg.body.offeringId
  )
  setOffering(offering)

  if (!recordThread.quote) {
    const records = await getChildRecords(web5, rfqMsg.to, recordThread.rfq)
    if (records && records[0]) {
      setRecordThread({ ...recordThread, quote: records[0] })
      setQuoteMsg((await records[0].data.json()) as TbDEXMessage<'quote'>)
    }
  } else if (recordThread.orderStatuses.length < 2) {
    const records = await getChildRecords(web5, rfqMsg.to, recordThread.quote)
    if (records) {
      setRecordThread({ ...recordThread, orderStatuses: records })
    }
  } else {
    clearInterval(interval)
  }
}

export const createRfq = async (
  web5: Web5,
  profileDid: string,
  pfiDid: string,
  offeringId: string,
  amount: string,
  kycProof: string,
  payinInstrument: string,
  payoutInstrument: string
) => {
  console.log(payoutInstrument)
  const amountInCents = currency(amount).multiply(100).value.toString()
  const payinKind =
    PaymentMethodKind[payinInstrument as keyof typeof PaymentMethodKind]
  const payoutKind =
    PaymentMethodKind[payoutInstrument as keyof typeof PaymentMethodKind]
  const rfq: Rfq = {
    offeringId: offeringId,
    amountCents: amountInCents,
    kycProof: kycProof,
    payinMethod: {
      kind: payinKind,
    },
    payoutMethod: {
      kind: payoutKind,
      paymentDetails: { btcAddress: '32PAofRVZLF3jY9x5P9qc8cc9QBY8pMivK' },
    },
  }

  const tbdexMsg = createMessage({
    to: pfiDid,
    from: profileDid,
    type: 'rfq',
    body: rfq,
  })

  console.log(tbdexMsg)

  const { record, status } = await web5.dwn.records.write({
    data: tbdexMsg,
    message: {
      protocol: aliceProtocolDefinition.protocol,
      protocolPath: 'RFQ',
      schema: aliceProtocolDefinition.types.RFQ.schema,
      recipient: pfiDid,
    },
  })
  
  console.log(status.code + ' ' + status.detail)

  if (record) {
    const { status: sendStatus } = await record.send(pfiDid)
    console.log(sendStatus.code + ' ' + sendStatus.detail)
  }
}
