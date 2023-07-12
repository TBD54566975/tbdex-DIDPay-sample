import React from 'react'
import { Offering, PaymentInstructions } from '@tbd54566975/tbdex'

export function formatPaymentMethod(paymentMethod: string): string {
  return paymentMethod
  //   const formattedString = paymentMethod
  //     .toLowerCase()
  //     .replace(/_/g, ' ')
  //     .replace(/\b\w/g, (match) => match.toUpperCase());

  //   return formattedString;
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
      } else if (payin.link) {
        instructions.push(
          <dd
            key="payin-link"
            className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
          >
            <span className="text-indigo-600">{payin.link}</span>
          </dd>
        )
      }
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
      } else if (payout.link) {
        instructions.push(
          <dd
            key="payout-link"
            className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
          >
            <span className="text-indigo-600">{payout.link}</span>
          </dd>
        )
      }
    }
  }

  return instructions.length > 0 ? <div>{instructions}</div> : null
}
