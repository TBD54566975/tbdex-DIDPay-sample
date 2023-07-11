import { ClockIcon } from '@heroicons/react/24/solid';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type OrderStatusItemProps = {
  id: string;
  index: number;
  lastIndex: number;
};

export function OrderStatusItem({
  id,
  index,
  lastIndex,
}: OrderStatusItemProps) {
  return (
    <li key={id} className="relative flex gap-x-4">
      <div
        className={classNames(
          index === lastIndex ? 'h-6' : '-bottom-6',
          'absolute left-0 top-0 flex w-6 justify-center'
        )}
      >
        <div className="w-px bg-indigo-600" />
      </div>
      <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
        {index === lastIndex ? (
          <ClockIcon className="h-6 w-6 text-indigo-600" aria-hidden="true" />
        ) : (
          <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 ring-1 ring-indigo-600" />
        )}
      </div>
      {/* <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
        Order status updated to{' '}
        <span className="font-medium text-gray-300">
          {statusToString(recordThread.orderStatuses[0].body.orderStatus)}
        </span>
        .
      </p>
      <div className="flex-none py-0.5 text-xs leading-5 text-gray-500">
        {dayjs(orderStatus.createdTime).fromNow(true)} ago
      </div> */}
    </li>
  );
}
