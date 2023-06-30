import { ThreadManager } from '../threads/ThreadManager';
import { useWeb5Context } from '../../context/Web5Context';
import { Rfq, Quote, TbDEXMessage } from '@tbd54566975/tbdex';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ArrowLeftIcon } from '@heroicons/react/20/solid';
import { ThreadData } from '../threads/ThreadManager';
import { ThreadFeed } from '../threads/ThreadFeed';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type ThreadProps = {
  threadData: ThreadData | undefined;
};
type MessageProps = {
  tbdexMsg: TbDEXMessage<'rfq' | 'quote'> | undefined;
  baseCurrency: String;
  quoteCurrency: String;
  lastInThread: boolean;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

function Message({
  tbdexMsg,
  baseCurrency,
  quoteCurrency,
  lastInThread,
}: MessageProps) {
  if (!tbdexMsg) {
    return null;
  }
  return (
    <>
      <li key={tbdexMsg.id}>
        <div className="relative pb-4 pt-4">
          {!lastInThread ? (
            <span
              className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
              aria-hidden="true"
            />
          ) : null}

          <div className="relative flex space-x-3">
            <div>
              <span
                className={classNames(
                  tbdexMsg?.type === 'rfq' ? 'bg-indigo-400' : 'bg-green-400',
                  'h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-neutral-900'
                )}
              >
                {tbdexMsg.type === 'rfq' ? (
                  <ArrowRightIcon
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowLeftIcon
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                )}{' '}
              </span>
            </div>
            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
              <div>
                <p className="text-sm text-gray-500 ">
                  {/* {tbdexMsg.threadId}{' '} */}
                  <Link to={''} className="font-medium text-gray-300">
                    {tbdexMsg.type === 'rfq' ? (
                      <span>
                        {' Request: '}
                        {baseCurrency}
                        {' for '}
                        {(tbdexMsg.body as Rfq).amount} {quoteCurrency}
                      </span>
                    ) : (
                      <span>
                        {' Quote: '}
                        {(tbdexMsg.body as Quote).amount}
                        {baseCurrency}
                        {' for '}
                        {(tbdexMsg.body as Quote).totalFee} {quoteCurrency}
                      </span>
                    )}
                  </Link>
                </p>
              </div>
              <div className="whitespace-nowrap text-right text-sm text-gray-500">
                <p className="whitespace-nowrap">
                  {tbdexMsg.type === 'rfq' ? 'Sent' : 'Received'}{' '}
                  {dayjs(tbdexMsg.createdTime).fromNow(true)} ago
                </p>
              </div>
            </div>
          </div>
        </div>
      </li>
    </>
  );
}

function Thread({ threadData }: ThreadProps) {
  if (!threadData || !threadData.rfq) {
    return null;
  }
  const rfqMsg = threadData.rfq;
  const baseCurrency = threadData.rfq?.body.baseCurrency;
  const quoteCurrency = threadData.rfq?.body.quoteCurrency;
  if (threadData.quote) {
    const quoteMsg = threadData.quote;

    return (
      <>
        <Message
          tbdexMsg={rfqMsg}
          baseCurrency={baseCurrency}
          quoteCurrency={quoteCurrency}
          lastInThread={false}
        ></Message>
        <Message
          tbdexMsg={quoteMsg}
          baseCurrency={baseCurrency}
          quoteCurrency={quoteCurrency}
          lastInThread={true}
        ></Message>
      </>
    );
  } else {
    return (
      <>
        <Message
          tbdexMsg={rfqMsg}
          baseCurrency={baseCurrency}
          quoteCurrency={quoteCurrency}
          lastInThread={true}
        ></Message>
      </>
    );
  }
}

export function OngoingOrdersPage() {
  const { web5, profile } = useWeb5Context();
  let threadManager: ThreadManager = new ThreadManager(web5);
  const keys = threadManager.getPendingStatusKeys();

  // const arr = threadManager.getThread(keys[0]);
  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        <div
          style={{
            color: 'var(--color-yellow)',
          }}
        >
          Ongoing Orders
        </div>
      </label>

      <ul className="mt-7">
        {keys.map((contextId, index) => {
          const threadData = threadManager.getThread(contextId);
          return (
            <div className="flow-root pb-7">
              <div className="overflow-hidden bg-neutral-900 shadow sm:rounded-lg rounded-md">
                <div className="px-4 py-6 sm:px-6">
                  {/* <Thread threadData={threadData}></Thread> */}
                  <ThreadFeed threadData={threadData}></ThreadFeed>
                </div>
              </div>
            </div>
          );
        })}
      </ul>
    </div>
  );
}
