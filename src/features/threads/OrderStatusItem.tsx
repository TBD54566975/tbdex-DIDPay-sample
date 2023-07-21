import React from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { classNames } from '../../utils/tailwind-utils'
import { TbdexThread } from '../../tbdex-thread'
import { formatEnum } from '../../components/PaymentUtils'

dayjs.extend(relativeTime)

type OrderStatusItemProps = {
  tbdexThread: TbdexThread
}

export function OrderStatusItem(props: OrderStatusItemProps) {
  const quote = props.tbdexThread.quote
  const orderStatuses = props.tbdexThread.orderStatuses

  if (!quote || orderStatuses.length < 1) {
    return <></>
  }

  const lastIndex = props.tbdexThread.orderStatuses.length - 1
  return (
    <>
      {orderStatuses.map((orderStatus, index) => {
        const statusMsg = orderStatus.message
        return (
          <li key={index} className="relative flex gap-x-4">
            <div
              className={classNames(
                index !== lastIndex ? '-bottom-6' : 'h-6',
                'absolute left-0 top-0 flex w-6 justify-center'
              )}
            >
              <div className="w-px bg-yellow-300" />
            </div>
            <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-300 ring-1 ring-yellow-300" />
            </div>
            <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
              Status update: {' '}
              <span className="font-medium text-gray-300">{formatEnum(statusMsg.body.orderStatus)}</span>.
            </p>
            <div className="flex-none py-0.5 text-xs leading-5 text-gray-500">
              {dayjs(statusMsg.createdTime).fromNow(true)} ago
            </div>
          </li>
        )
      })}
    </>
  )
}
