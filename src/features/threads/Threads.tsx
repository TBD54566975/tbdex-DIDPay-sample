import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ThreadData } from './ThreadManager';
import { QuoteCard } from '../quotes/QuoteCard';
import { Status } from '@tbd54566975/tbdex';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type ThreadsProps = {
  threadData: ThreadData | undefined;
};

const handleRespondToQuote = () => {
  // setSelectedOffering(offering);
  // TODO: do we even need a respond button?
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function Threads({ threadData }: ThreadsProps) {
  if (!threadData || !threadData.rfq) {
    return null;
  }
  const rfqMsg = threadData.rfq;
  const amount = threadData.rfq?.body.amount;
  const baseCurrency = threadData.rfq?.body.baseCurrency;
  const quoteCurrency = threadData.rfq?.body.quoteCurrency;

  function statusToString(status: Status): string {
    if (status === Status.COMPLETED) {
      return 'Completed';
    } else if (status === Status.FAILED) {
      return 'Failed';
    } else {
      return 'Pending';
    }
  }

  return (
    <>
      <ul className="space-y-6">
        <li key={rfqMsg.id} className="relative flex gap-x-4">
          <div
            className={classNames(
              '-bottom-6',
              'absolute left-0 top-0 flex w-6 justify-center'
            )}
          >
            {threadData.orderStatuses.length > 0 && (
              <div
                className={classNames(
                  '-bottom-6',
                  'absolute left-0 top-0 flex w-6 justify-center'
                )}
              >
                <div className="w-px bg-indigo-600" />
              </div>
            )}
          </div>
          <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
            <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 ring-1 ring-indigo-600" />
          </div>
          <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
            {'You requested '}
            <span className="font-medium text-gray-300">{baseCurrency}</span>
            {' for '}
            <span className="font-medium text-gray-300">
              {amount + ' ' + quoteCurrency}
            </span>
            .
          </p>
          <div className="flex-none py-0.5 text-xs leading-5 text-gray-500">
            {dayjs(rfqMsg.createdTime).fromNow(true)} ago
          </div>
        </li>
        {threadData.orderStatuses.map((orderStatus, index) => (
          <li key={orderStatus.id} className="relative flex gap-x-4">
            <div
              className={classNames(
                index === threadData.orderStatuses.length - 1 &&
                  !threadData.quote
                  ? 'h-6'
                  : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center'
              )}
            >
              <div className="w-px bg-indigo-600" />
            </div>
            <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
              {index === threadData.orderStatuses.length - 1 &&
              !threadData.quote ? (
                <ClockIcon
                  className="h-6 w-6 text-indigo-600"
                  aria-hidden="true"
                />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 ring-1 ring-indigo-600" />
              )}
            </div>
            <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
              Order status updated to{' '}
              <span className="font-medium text-gray-300">
                {statusToString(orderStatus.body.orderStatus)}
              </span>
              .
            </p>
            <div className="flex-none py-0.5 text-xs leading-5 text-gray-500">
              {dayjs(orderStatus.createdTime).fromNow(true)} ago
            </div>
          </li>
        ))}
        {threadData.quote && (
          <li key={threadData.quote.id} className="relative flex gap-x-4">
            <div
              className={classNames(
                false ? 'h-6' : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center'
              )}
            >
              <div className="w-px bg-indigo-600" />
            </div>
            <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
              {false ? (
                <CheckCircleIcon
                  className="h-6 w-6 text-indigo-600"
                  aria-hidden="true"
                />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 ring-1 ring-indigo-600" />
              )}
            </div>
            <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
              {'PFI offered '}
              <span className="font-medium text-gray-300">
                {threadData.quote.body.amount + ' ' + baseCurrency}
              </span>{' '}
              for{' '}
              <span className="font-medium text-gray-300">
                {threadData.quote.body.totalFee + ' ' + quoteCurrency}
              </span>
              .
            </p>
            <time
              dateTime={threadData.quote.createdTime}
              className="flex-none py-0.5 text-xs leading-5 text-gray-500"
            >
              {dayjs(threadData.quote.createdTime).fromNow(true)} ago
            </time>
          </li>
        )}
      </ul>

      {/* New comment form */}
      {threadData.quote && (
        <div className="mt-6 flex gap-x-3">
          <ExclamationCircleIcon className="h-6 w-6 flex-none rounded-full text-indigo-600" />

          <div className="relative flex-auto rounded-md py-1 px-2 text-xs font-medium ring-1 ring-gray-300">
            <QuoteCard
              threadData={threadData}
              baseCurrency={baseCurrency}
              quoteCurrency={quoteCurrency}
              handleAction={handleRespondToQuote}
            ></QuoteCard>
          </div>
        </div>
      )}
    </>
  );
}
