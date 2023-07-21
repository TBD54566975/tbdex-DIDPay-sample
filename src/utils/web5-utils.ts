import { aliceProtocolDefinition, createMessage, Offering, PaymentMethodResponse, Rfq } from '@tbd54566975/tbdex'
import { DateSort } from '@tbd54566975/dwn-sdk-js'
import { Web5 } from '@tbd54566975/web5'
import { getSubunits } from './currency-utils'
import { TbdexThread } from '../tbdex-thread'

/**
 * Gets the offerings from a given PFI (Participating Financial Institution) DWN.
 * @param web5 - The Web5 instance.
 * @param pfiDid - The DID needed to query the PFI's DWN.
 * @returns {Promise<Offering[]>} - A Promise that resolves to an array of Offering objects.
 */
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

/**
 * Gets the Tbdex Messages grouped together by record.contextId.
 * @param web5 - The Web5 instance.
 * @returns {Promise<TbdexThread[]>} - A Promise that resolves to an array of TbdexThread objects.
 */
export async function getThreads(web5: Web5) {
  const threads: TbdexThread[] = []

  const { records = [], status } = await web5.dwn.records.query({
    message: {
      filter: {
        schema: aliceProtocolDefinition.types.RFQ.schema,
      },
      dateSort: DateSort.CreatedDescending
    },
  })

  if (status.code !== 200) {
    throw new Error(`Failed to get tbdex threads. Error: ${JSON.stringify(status, null, 2)}`)
  }

  for (const record of records) {
    const tbdexThread = await TbdexThread.fetch(web5, record.contextId)
    threads.push(tbdexThread)
  }

  return threads
}

/**
 * Gets the verifiable credentials stored in the user's DWN.
 * @param web5 - The Web5 instance.
 * @returns {Promise<any[]>} - A Promise that resolves to an array of verifiable credential objects.
 */
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

/**
 * Stores the given verifiable credentials (VC) in the user's DWN.
 * @param web5 - The Web5 instance.
 * @param vcJwt - The verifiable credential as a JWT (JSON Web Token).
 * @returns {Promise<void>} - A Promise that resolves after the VC is stored.
 */
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

/**
 * Creates a request for quote (RFQ) message and sends it to the PFI.
 * @param web5 - The Web5 instance.
 * @param offering - The Offering object representing the offering that the RFQ references.
 * @param profileDid - The DID of the user creating the RFQ.
 * @param pfiDid - The DID of the PFI receiving the RFQ.
 * @param quoteAmount - The amount that is requested for the quote.
 * @param kycProof - The proof of KYC (Know Your Customer) verification.
 * @param payinMethodKind - The payment method kind for payin.
 * @param payoutMethodKind - The payment method kind for payout.
 * @param payoutDetails - Additional details for the payout method.
 * @returns {Promise<void>} - A Promise that resolves after the RFQ is sent to the PFI.
 */
export async function createRfq(web5: Web5, offering: Offering, profileDid: string, pfiDid: string, quoteAmount: string, kycProof: string, payinMethodKind: string, payoutMethodKind: string, payoutDetails: any) {
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
  const tbdexMsg = createMessage({
    to: pfiDid,
    from: profileDid,
    type: 'rfq',
    body: rfq,
  })

  const { record, status } = await web5.dwn.records.write({
    data: tbdexMsg,
    message: {
      protocol: aliceProtocolDefinition.protocol,
      protocolPath: 'RFQ',
      schema: aliceProtocolDefinition.types.RFQ.schema,
      recipient: pfiDid,
    },
  })
  
  if (record) {
    const { status: sendStatus } = await record.send(pfiDid)
    console.log(sendStatus.code + ' ' + sendStatus.detail)
  }
}
