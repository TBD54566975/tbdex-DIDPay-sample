import React from 'react'
import { ChevronRightIcon, CodeBracketIcon, CreditCardIcon, } from '@heroicons/react/20/solid'
import { Offering } from '@tbd54566975/tbdex'
import { formatPaymentMethodKind } from '../../components/PaymentUtils'
import { USD, getExchangeRate } from '../../utils/currency-utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

type OfferingCard = {
  offering: Offering;
  onClick: () => void;
}

// TODO: add a back button
export function OfferingCard(props: OfferingCard) {
  const quoteCurrency = props.offering.quoteCurrency.currencyCode
  const quoteMinUnits = USD(props.offering.quoteCurrency.minSubunit).format()
  const quoteMaxUnits = USD(props.offering.quoteCurrency.maxSubunit).format()

  return (
    <div className="overflow-hidden bg-neutral-900 shadow rounded-lg">
      <div className="px-4 py-6 sm:px-6 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-300">
            {props.offering?.description ?? 'No description available'}
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
            Listed {dayjs(props.offering.createdTime).fromNow(true)} ago
          </p>
        </div>
        <div onClick={() => props.onClick()}>
          <div className="flex items-center">
            <div className="text-indigo-600 text-sm">Request</div>
            <ChevronRightIcon
              className="h-5 w-5 flex-none text-gray-400 ml-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-50/5">
        <dl className="divide-y divide-gray-50/5">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">Exchange rate</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
              {getExchangeRate(
                props.offering.quoteUnitsPerBaseUnit,
                props.offering.baseCurrency.currencyCode,
                props.offering.quoteCurrency.currencyCode
              )}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">Minimum order</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
              {quoteMinUnits} {quoteCurrency}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">Maximum order</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
              {quoteMaxUnits} {quoteCurrency}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium leading-6 text-gray-300">
              Payin methods
            </dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul className="divide-y divide-gray-100 rounded-md border border-gray-50/5">
                {props.offering.payinMethods.map((payin, index) => (
                  <li
                    key={`payin${index}`}
                    className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                  >
                    <div className="flex w-0 flex-1 items-center">
                      <CreditCardIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium text-gray-400">
                          {formatPaymentMethodKind(payin.kind)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 font-medium text-gray-400 hover:text-indigo-500">
                      {payin.feeSubunits
                        ? `${USD(payin.feeSubunits).format()} ${
                          quoteCurrency
                        } fee`
                        : 'No flat fee'}
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium leading-6 text-gray-300">
              Payout methods
            </dt>
            <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <ul className="divide-y divide-gray-100 rounded-md border border-gray-50/5">
                {props.offering.payoutMethods.map((payout, index) => (
                  <li
                    key={`payout${index}`}
                    className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
                  >
                    <div className="flex w-0 flex-1 items-center">
                      <CodeBracketIcon
                        className="h-5 w-5 flex-shrink-0 text-gray-400"
                        aria-hidden="true"
                      />
                      <div className="ml-4 flex min-w-0 flex-1 gap-2">
                        <span className="truncate font-medium text-gray-400">
                          {formatPaymentMethodKind(payout.kind)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0 font-medium text-gray-400 hover:text-indigo-500">
                      {payout.feeSubunits
                        ? `${USD(payout.feeSubunits).format()} ${
                          quoteCurrency
                        } fee`
                        : 'No flat fee'}
                    </div>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
