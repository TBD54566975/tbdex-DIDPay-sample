import {
  aliceProtocolDefinition,
  createMessage,
  Offering,
  PaymentMethodResponse,
  Rfq,
  TbDEXMessage,
} from '@tbd54566975/tbdex'

import { DateSort } from '@tbd54566975/dwn-sdk-js'
import { Web5 } from '@tbd54566975/web5'
import { TbdexThread } from './TbdexThread'
import { getSubunits } from './CurrencyUtils'
import { RecordThread } from '../features/threads/Thread'
import { Record } from '@tbd54566975/web5/dist/types/record'


export async function getVcs(web5: Web5) {
  const { records, status: vcQueryStatus } = await web5.dwn.records.query({
    message: {
      filter: {
        dataFormat: 'application/vc+ld+json'
      }
    }
  })

  if (vcQueryStatus.code !== 200) {
    throw new Error(`failed to get pre-existing VCs. Error: ${JSON.stringify(vcQueryStatus, null, 2)}`)
  }

  const vcs = []

  for (const record of records) {
    const vc = await record.data.text()
    vcs.push(vc)
  }

  return vcs
}

export async function storeVc(web5: Web5, vcJwt: string) {
  const { status } = await web5.dwn.records.write({
    data    : vcJwt,
    message : {
      dataFormat: 'application/vc+ld+json'
    }
  })

  if (status.code !== 202) {
    throw new Error(`failed to write KYC VC to alice dwn. Error: ${JSON.stringify(status, null, 2)}`)
  }


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

export const getOfferingFromRfq = async (
  web5: Web5,
  rfqMsg: TbDEXMessage<'rfq'>,
) => {
  const { records = [] } = await web5.dwn.records.query({
    from: rfqMsg.to,
    message: {
      filter: {
        schema: 'https://tbd.website/resources/tbdex/Offering',
      },
    },
  })

  for (const record of records) {
    const offering = await record.data.json()
    if (offering.id === rfqMsg.body.offeringId) {
      return offering
    }
  }
}

export const threadInit = async (
  web5: Web5,
  recordThread: RecordThread,
  pfiDid: string,
  setRecordThread: React.Dispatch<React.SetStateAction<RecordThread>>,
) => {
  try {
    console.log('beginning thread init')
    const { records = [] } = await web5.dwn.records.query({
      from: pfiDid,
      message: {
        filter: {
          contextId: recordThread.rfqRecord.contextId
        },
        dateSort: DateSort.CreatedAscending
      },
    })

    for (const record of records) {
      const tbdexMsg = await record.data.json()
      console.log(tbdexMsg)
      if (tbdexMsg.type === 'quote') {
        setRecordThread({ ...recordThread, quote: tbdexMsg })      
      } else if (tbdexMsg.type === 'orderStatus') {
        setRecordThread({ ...recordThread, orderStatuses: [...recordThread.orderStatuses, tbdexMsg] })  
      } else if (tbdexMsg.type === 'close') {
        setRecordThread({ ...recordThread, close: tbdexMsg })      
      }
    }
    
  } catch (error) {
    // console.log('No child for record: ' + record.id);
  }

}

export const createRfq = async (
  web5: Web5,
  offering: Offering,
  profileDid: string,
  pfiDid: string,
  quoteAmount: string,
  kycProof: string,
  payinMethodKind: string,
  payoutMethodKind: string,
  payoutDetails: any
) => {
  const quoteAmountSubunits = getSubunits(quoteAmount)
  const payinMethodResponse: PaymentMethodResponse = {
    kind: payinMethodKind
  }
  const payoutMethodResponse: PaymentMethodResponse = {
    kind: payoutMethodKind,
    paymentDetails: payoutDetails
  }
  const rfq: Rfq = {
    offeringId: offering.id,
    quoteAmountSubunits: quoteAmountSubunits,
    kycProof: kycProof,
    payinMethod: payinMethodResponse,
    payoutMethod: payoutMethodResponse
  }

  console.log(rfq)

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
  
  // console.log(status.code + ' ' + status.detail)

  if (record) {
    const { status: sendStatus } = await record.send(pfiDid)
    console.log(sendStatus.code + ' ' + sendStatus.detail)
  }
}
