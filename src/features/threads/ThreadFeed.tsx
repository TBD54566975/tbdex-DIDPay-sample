import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { ThreadData } from './ThreadManager';
import { Status } from '@tbd54566975/tbdex';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type ThreadProps = {
  threadData: ThreadData | undefined;
};

type QuoteCardProps = {
  threadData: ThreadData;
  baseCurrency: string;
  quoteCurrency: string;
  handleAction: () => void;
};

const handleRespondToQuote = () => {
  // setSelectedOffering(offering);
  // TODO: handle onclick
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function getRate(
  unitPrice: string,
  quoteCurrency: string,
  baseCurrency: string
) {
  return `1 ${quoteCurrency} / ${unitPrice} ${baseCurrency}`;
}

function QuoteCard({
  threadData,
  baseCurrency,
  quoteCurrency,
  handleAction,
}: QuoteCardProps) {
  const quote = threadData?.quote;
  return (
    <div className="overflow-hidden bg-neutral-900 shadow sm:rounded-lg">
      <div className="px-4 py-6 sm:px-6 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-300">
            TODO: Replace Header
          </h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-red-500">
            Expires in{' '}
            {dayjs(quote?.body.expiryTime).fromNow(true) ??
              'No description available'}
          </p>
        </div>
        <div onClick={() => handleAction()}>
          <div className="flex items-center">
            <div className="text-indigo-600 text-sm">Respond</div>
            <ChevronRightIcon
              className="h-5 w-5 flex-none text-gray-400 ml-1"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">Total fee</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
              {quote?.body.totalFee} {quoteCurrency}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">Amount</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
              {quote?.body.amount} {baseCurrency}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export function ThreadFeed({ threadData }: ThreadProps) {
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
        {threadData.orderStatuses.map((orderStatus, activityItemIdx) => (
          <li key={orderStatus.id} className="relative flex gap-x-4">
            <div
              className={classNames(
                activityItemIdx === 1 ? 'h-6' : '-bottom-6',
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
          <ExclamationCircleIcon className="h-6 w-6 flex-none rounded-full bg-yellow-300" />
          {/* <form action="#" className="relative flex-auto">
            <div className="overflow-hidden rounded-lg pb-12 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600">
              <label htmlFor="comment" className="sr-only">
                Add your comment
              </label>
              <textarea
                rows={2}
                name="comment"
                id="comment"
                className="block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                placeholder="Respond to the PFI..."
                defaultValue={''}
              />
            </div>

            <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
              <div className="flex items-center space-x-5"></div>

              <button
                type="submit"
                className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Respond
              </button>
            </div>
          </form> */}
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
