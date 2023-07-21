import React from 'react'
import { PaymentInstructions } from '@tbd54566975/tbdex'

/**
 * Formats the payment method kind enum.
 * @param paymentMethod - The payment method kind string (e.g., 'CASHAPP_PAY', 'BTC_ADDRESS').
 * @returns {string} - The formatted payment method kind (e.g., 'Cash App Pay', 'BTC Address').
 */
export function formatPaymentMethodKind(paymentMethod: string): string {
  let key = formatEnum(paymentMethod)
  key = key.replace('Btc', 'BTC ')
  key = key.replace('Cashapp', 'Cash App ')

  return key
}

/**
 * Removes underscore and all caps from enum strings.
 * @param orderStatus - The order status string (e.g., 'PAYIN_INITIATED', 'PAYOUT_FAILED').
 * @returns {string} - The formatted order status (e.g., 'Payin Intiated', 'Payout Failed').
 */
export function formatEnum(str: string): string {
  const key = str.toLowerCase().replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function(key) { return key.toUpperCase()})

  return key
}

/**
 * Generates JSX elements for displaying payment instructions.
 * @param paymentInstructions - The PaymentInstructions object containing payin and payout details.
 * @returns {JSX.Element | null} - JSX elements for displaying payment instructions, or null if no instructions are available.
 */
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
    }
  }

  return instructions.length > 0 ? <div>{instructions}</div> : null
}
