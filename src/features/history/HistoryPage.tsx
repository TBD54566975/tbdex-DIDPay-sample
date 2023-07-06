import { Status } from '@tbd54566975/tbdex';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import { useWeb5Context } from '../../context/Web5Context';
import { ThreadManager } from '../threads/ThreadManager';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type StatusText = {
  [key: string]: string;
};
type StatusIndicator = {
  [key: string]: string;
};

const statusIndicator: StatusIndicator = {
  Completed: 'text-green-400 bg-green-400/10',
  Pending: 'text-gray-400 bg-gray-400/10',
  Failed: 'text-rose-400 bg-rose-400/10',
};
const statusText: StatusText = {
  Completed: 'text-green-400 bg-green-400/10 ring-gray-400/20',
  Pending: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  Failed: 'text-rose-400 bg-rose-400/10 ring-gray-400/20',
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function HistoryPage() {
  const { web5, profile } = useWeb5Context();
  // TODO: poll instead of using thread manager
  let threadManager: ThreadManager = new ThreadManager(web5);
  const keys = threadManager.getCompletedOrFailedStatusKeys();

  function getThreadStatusString(contextId: string): string {
    const status = threadManager.getThreadStatus(contextId);

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
      <ul className="divide-y divide-white/20">
        {keys.map((contextId) => {
          const message = threadManager.getLatestThreadMessage(contextId);
          if (message) {
            return (
              <li
                key={message.id}
                className="relative flex items-center space-x-4 py-4"
              >
                <div className="min-w-0 flex-auto">
                  <div className="flex items-center gap-x-3">
                    <div
                      className={classNames(
                        statusIndicator[getThreadStatusString(contextId)],
                        'flex-none rounded-full p-1'
                      )}
                    >
                      <div className="h-2 w-2 rounded-full bg-current" />
                    </div>
                    <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                      <Link to={'#'} className="flex gap-x-2">
                        <span className="text-gray-400"></span>
                        <span className="whitespace-nowrap">{message.id}</span>
                        <span className="absolute inset-0" />
                      </Link>
                    </h2>
                  </div>
                  <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
                    <p className="truncate">{message.to}</p>
                    <svg
                      viewBox="0 0 2 2"
                      className="h-0.5 w-0.5 flex-none fill-gray-300"
                    >
                      <circle cx={1} cy={1} r={1} />
                    </svg>
                    <p className="whitespace-nowrap">
                      Created {dayjs(message.createdTime).fromNow(true)} ago
                    </p>
                  </div>
                </div>
                <div
                  className={classNames(
                    statusText[getThreadStatusString(contextId)],
                    'rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset'
                  )}
                >
                  {getThreadStatusString(contextId)}
                </div>
                <ChevronRightIcon
                  className="h-5 w-5 flex-none text-gray-400"
                  aria-hidden="true"
                />
              </li>
            );
          }
          return null;
        })}
      </ul>
    </>
  );
}

// return (
//   <>
//     <ul className="divide-y divide-white/20">
//       {(selectedTab === 'View All'
//         ? chronologicalMessages
//         : selectedTab === 'Quotes'
//         ? quoteMessages
//         : orderMessages
//       ).map(
//         (
//           message // Your rendering logic for each offering item
//         ) => (
//           <>
//             <li
//               key={message.id}
//               className="relative flex items-center space-x-4 py-4"
//             >
//               <div className="min-w-0 flex-auto">
//                 <div className="flex items-center gap-x-3">
//                   <div
//                     className={classNames(
//                       //   statuses[offering.status],
//                       statuses['success'],
//                       'flex-none rounded-full p-1'
//                     )}
//                   >
//                     <div className="h-2 w-2 rounded-full bg-current" />
//                   </div>
//                   <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
//                     <Link to={'#'} className="flex gap-x-2">
//                       <span className="text-gray-400"></span>
//                       <span className="whitespace-nowrap">
//                         {message.type}
//                       </span>
//                       <span className="absolute inset-0" />
//                     </Link>
//                   </h2>
//                 </div>
//                 <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
//                   {selectedTab === 'View All' ? (
//                     <p className="truncate">{message.to}</p>
//                   ) : selectedTab === 'Quotes' ? (
//                     message.type === 'RFQ' ? (
//                       <p className="truncate">{(message.body as Rfq).pair}</p>
//                     ) : (
//                       // Render something else for non-RFQ types
//                       <p className="truncate">
//                         {(message.body as Quote).totalFee}
//                       </p>
//                     )
//                   ) : (
//                     // selectedTab === 'order'
//                     <p className="truncate">hmm what should i put here</p>
//                   )}
//                   <svg
//                     viewBox="0 0 2 2"
//                     className="h-0.5 w-0.5 flex-none fill-gray-300"
//                   >
//                     <circle cx={1} cy={1} r={1} />
//                   </svg>
//                   <p className="whitespace-nowrap">{message.createdTime}</p>
//                 </div>
//               </div>
//               <div
//                 className={classNames(
//                   quoteStatus[
//                     message.type === 'Order'
//                       ? 'Failed'
//                       : message.type === 'Quote'
//                       ? 'Pending'
//                       : 'Success'
//                   ],
//                   'rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset'
//                 )}
//               >
//                 {message.type === 'Order'
//                   ? 'Failed'
//                   : message.type === 'Quote'
//                   ? 'Pending'
//                   : 'Success'}
//               </div>
//               <ChevronRightIcon
//                 className="h-5 w-5 flex-none text-gray-400"
//                 aria-hidden="true"
//               />
//             </li>{' '}
//           </>
//         )
//       )}
//     </ul>
//     {/* <OrdersTabs selectedTab={selectedTab} onSelectTab={setSelectedTab} /> */}
//   </>
// );
