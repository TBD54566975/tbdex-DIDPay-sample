import React from 'react'
import { ClockIcon } from '@heroicons/react/24/solid'
import { TbdexThread } from '../../utils/TbdexThread'
import { formatOrderStatus } from '../../utils/TbdexUtils'
import { OrderStatus, Status, TbDEXMessage } from '@tbd54566975/tbdex'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

type OrderStatusItemProps = {
  tbdexThread: TbdexThread
}

// const init: OrderStatus = {
//   orderStatus: Status.PAYIN_INITIATED
// }
// const comp: OrderStatus = {
//   orderStatus: Status.PAYIN_COMPLETED
// }

// const tbdInit = {
//   type: 'orderStatus',
//   body: init,
//   createdTime: ''
// }
// const tbdComp = {
//   type: 'orderStatus',
//   body: comp,
//   createdTime: ''
// }

// const fake = [{ message: tbdInit }, { message: tbdComp }]

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
              <span className="font-medium text-gray-300">{formatOrderStatus(statusMsg.body.orderStatus)}</span>.
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
