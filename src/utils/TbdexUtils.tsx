import React from 'react'

import { Web5 } from '@tbd54566975/web5'
import { PaymentInstructions, aliceProtocolDefinition } from '@tbd54566975/tbdex'

import { TbdexThread } from './TbdexThread'
import { DateSort } from '@tbd54566975/dwn-sdk-js'

export function formatPaymentMethodKind(paymentMethod: string): string {
  let key = paymentMethod.toLowerCase().replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function(key) { return key.toUpperCase()})
  key = key.replace('Btc', 'BTC ')

  return key
}

export function getPaymentInstructions(
  paymentInstructions?: PaymentInstructions
) {
  const instructions: JSX.Element[] = []

  if (paymentInstructions) {
    if (paymentInstructions.payin) {
      const payin = paymentInstructions.payin
      if (payin.instruction && payin.link) {
        instructions.push(
          <dd
            key="payin-instruction-link"
            className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
          >
            {payin.instruction}:{' '}
            <span className="text-indigo-600">{payin.link}</span>
          </dd>
        )
      } else if (payin.instruction) {
        instructions.push(
          <dd
            key="payin-instruction"
            className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
          >
            {payin.instruction}
          </dd>
        )
      } 
      // else if (payin.link) {
      //   instructions.push(
      //     <dd
      //       key="payin-link"
      //       className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
      //     >
      //       <span className="text-indigo-600">{payin.link}</span>
      //     </dd>
      //   )
      // }
    }

    if (paymentInstructions.payout) {
      const payout = paymentInstructions.payout
      if (payout.instruction && payout.link) {
        instructions.push(
          <dd
            key="payout-instruction-link"
            className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
          >
            {payout.instruction}:{' '}
            <span className="text-indigo-600">{payout.link}</span>
          </dd>
        )
      } else if (payout.instruction) {
        instructions.push(
          <dd
            key="payout-instruction"
            className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
          >
            {payout.instruction}
          </dd>
        )
      }
      //  else if (payout.link) {
      //   instructions.push(
      //     <dd
      //       key="payout-link"
      //       className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
      //     >
      //       <span className="text-indigo-600">{payout.link}</span>
      //     </dd>
      //   )
      // }
    }
  }

  return instructions.length > 0 ? <div>{instructions}</div> : null
}

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