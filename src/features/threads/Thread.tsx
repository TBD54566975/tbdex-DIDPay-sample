import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { QuoteCard } from '../quotes/QuoteCard';
import {
  TbDEXMessage,
  OrderStatus,
  Status,
  aliceProtocolDefinition,
} from '@tbd54566975/tbdex';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { useWeb5Context } from '../../context/Web5Context';
import { Record } from '@tbd54566975/web5/dist/types/record';
import { PaymentModal } from '../quotes/PaymentModal';

dayjs.extend(relativeTime);

export type RecordThread = {
  rfq?: Record;
  quote?: Record;
  orderStatuses: Record[];
};

type ThreadProps = {
  props: RecordThread;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

// kw:
// - consider DWN Records vs TBDex Messages...
//    - there may be a way to abstract that in a way which makes the code
//      more readable
// - orderStatuses is an array... but does that make things difficult?
//    - what if we did orderStatusPending, orderStatusCompleted, orderStatusFailed ...?
//    - this goes into the first point, about how we're mixing abstractions
// - I do wonder if... we could introduce a pure TypeScript class, called `DwnTBDexThread`
//    which would handle all of the semantics, and then we use it here to tie it to React
//    concepts such as the useEffect() and useState()
export function Thread({ props }: ThreadProps) {
  const [recordThread, setRecordThread] = useState<RecordThread>({
    rfq: props.rfq,
    orderStatuses: [],
  });
  const [rfqMsg, setRfqMsg] = useState<TbDEXMessage<'rfq'>>();
  const [quoteMsg, setQuoteMsg] = useState<TbDEXMessage<'quote'>>();

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const { web5 } = useWeb5Context();

  const handleModalClose = () => {
    setPaymentModalOpen(false);
  };

  // TODO: do we even need a respond button?
  const handleRespondToQuote = () => {
    const url = quoteMsg?.body.paymentInstructions?.payin?.link || '';
    window.open(url, '_blank', 'noreferrer');

    // setPaymentModalOpen(true);
  };

  async function queryChildRecords(record: any): Promise<Array<any> | void> {
    if (record.id) {
      const { records } = await web5.dwn.records.query({
        from: 'did:ion:EiDk8Kmu7lYgIolDeENZqTWbBpUpKY76TgO4JCgAcruAGg:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJhdXRoeiIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJSTWVlT1NTMC13dFpGeUVEaVQtRVhKVUFKODh4UHFQRGZvQlNNY2ttNm9FIiwieSI6InlUcmRpY05fWTZWNV9fWFl3OEttcHVYSWhnZEU0VnhKZjI5clV6UzRxUDAifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6Ikpzb25XZWJLZXkyMDIwIn0seyJpZCI6ImVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiI0LXROdG42d1l4VVZaa1JNQXFXS0ZoODNWTFBTd0pZRTY5T3EteEhJWVU0IiwieSI6ImRteG54Q3BkX0VfdlNMZ3pDdGV3UEtuQkpKNi1IRW9yZmtDb2p0NDZ4eFEifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7Im1lc3NhZ2VBdXRob3JpemF0aW9uS2V5cyI6WyIjYXV0aHoiXSwibm9kZXMiOlsiaHR0cDovL2xvY2FsaG9zdDo5MDAwIl0sInJlY29yZEVuY3J5cHRpb25LZXlzIjpbIiNlbmMiXX0sInR5cGUiOiJEZWNlbnRyYWxpemVkV2ViTm9kZSJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQi1CZ0czM2sxZVhreVBGVTNDaWl5VEhyUEw4SHU1cDZzM0lqMHB2bUhUUlEifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUJ6Nm5BclNfeDZaYmdIbTNJdFlPcW1UU2ctU2s1OFk0Z1ZoSUQ2UVFXa2VnIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlEUUlYUmotaEV0SmVBT1lteUdsMDYxZ0hzTU8xdFZkSVZJb19MZzVsdFRlZyJ9fQ',
        message: {
          filter: {
            parentId: record.id,
          },
        },
      });

      return records;
    }
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      setRfqMsg((await recordThread.rfq?.data.json()) as TbDEXMessage<'rfq'>);

      if (!recordThread.quote) {
        const records = await queryChildRecords(recordThread.rfq);
        if (records) {
          setRecordThread({ ...recordThread, quote: records[0] });
          setQuoteMsg((await records[0].data.json()) as TbDEXMessage<'quote'>);
        }
      } else if (recordThread.orderStatuses.length < 2) {
        // kw: you could make this more robust, instead of hard coding 2
        // OrderStatus: PENDING -> FAILED|COMPLETED
        const records = await queryChildRecords(recordThread.quote);
        if (records) {
          setRecordThread({ ...recordThread, orderStatuses: records });
          // TODO: create state var for orderstatus tbdex messages
        }
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }, []);

  // const rfqMsg = threadData.rfq;
  // const amount = threadData.rfq?.body.amount;
  // const baseCurrency = threadData.rfq?.body.baseCurrency;
  // const quoteCurrency = threadData.rfq?.body.quoteCurrency;

  function statusToString(status: Status): string {
    if (status === Status.COMPLETED) {
      return 'Completed';
    } else if (status === Status.FAILED) {
      return 'Failed';
    } else {
      return 'Pending';
    }
  }

  if (!rfqMsg) {
    return null;
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
            {recordThread.quote && (
              <div
                className={classNames(
                  '-bottom-6',
                  'absolute left-0 top-0 flex w-6 justify-center'
                )}
              >
                <div className="w-px bg-yellow-300" />
              </div>
            )}
          </div>
          <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
            <div className="h-1.5 w-1.5 rounded-full bg-yellow-300 ring-1 ring-yellow-300" />
          </div>
          <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
            {'You requested '}
            <span className="font-medium text-gray-300">
              {rfqMsg.body.baseCurrency}
            </span>
            {' for '}
            <span className="font-medium text-gray-300">
              {rfqMsg.body.amount + ' ' + rfqMsg.body.quoteCurrency}
            </span>
            .
          </p>
          <div className="flex-none py-0.5 text-xs leading-5 text-gray-500">
            {dayjs(rfqMsg.createdTime).fromNow(true)} ago
          </div>
        </li>

        {recordThread.quote && (
          <li key={recordThread.quote.id} className="relative flex gap-x-4">
            <div
              className={classNames(
                false ? 'h-6' : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center'
              )}
            >
              <div className="w-px bg-yellow-300" />
            </div>
            <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
              {false ? (
                <CheckCircleIcon
                  className="h-6 w-6 text-yellow-300"
                  aria-hidden="true"
                />
              ) : (
                <div className="h-1.5 w-1.5 rounded-full bg-yellow-300 ring-1 ring-yellow-300" />
              )}
            </div>
            <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
              {'PFI offered '}
              <span className="font-medium text-gray-300">
                {quoteMsg?.body.amount + ' ' + rfqMsg.body.baseCurrency}
              </span>{' '}
              for{' '}
              <span className="font-medium text-gray-300">
                {quoteMsg?.body.totalFee + ' ' + rfqMsg.body.quoteCurrency}
              </span>
              .
            </p>
            <time
              dateTime={quoteMsg?.createdTime}
              className="flex-none py-0.5 text-xs leading-5 text-gray-500"
            >
              {dayjs(quoteMsg?.createdTime).fromNow(true)} ago
            </time>
          </li>
        )}

        {recordThread.orderStatuses?.map((orderStatus, index) => (
          <li key={orderStatus.id} className="relative flex gap-x-4">
            <div
              className={classNames(
                index === recordThread.orderStatuses.length - 1
                  ? 'h-6'
                  : '-bottom-6',
                'absolute left-0 top-0 flex w-6 justify-center'
              )}
            >
              <div className="w-px bg-indigo-600" />
            </div>
            <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
              {index === recordThread.orderStatuses.length - 1 ? (
                <ClockIcon
                  className="h-6 w-6 text-indigo-600"
                  aria-hidden="true"
                />
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
        ))}
      </ul>

      {recordThread.quote && recordThread.orderStatuses.length < 1 && (
        <div className="mt-6 flex gap-x-3">
          <ExclamationCircleIcon className="h-6 w-6 flex-none rounded-full text-yellow-300" />

          <div className="relative flex-auto rounded-md py-1 px-2 text-xs font-medium ring-1 ring-gray-300">
            <QuoteCard
              quoteMsg={quoteMsg}
              baseCurrency={rfqMsg.body.baseCurrency}
              quoteCurrency={rfqMsg.body.quoteCurrency}
              handleAction={handleRespondToQuote}
            ></QuoteCard>
            <PaymentModal
              link={quoteMsg?.body.paymentInstructions?.payin?.link || ''}
              isOpen={paymentModalOpen}
              onClose={handleModalClose}
            ></PaymentModal>
          </div>
        </div>
      )}
    </>
  );
}

// export function Threads({ threadData }: ThreadsProps) {
//   // const [thread, setThread] = useState(yourProp);
//   // useEffect(() => setInterval(() => {}, 1000), []);

//   if (!threadData || !threadData.rfq) {
//     return null;
//   }
//   const rfqMsg = threadData.rfq;
//   const amount = threadData.rfq?.body.amount;
//   const baseCurrency = threadData.rfq?.body.baseCurrency;
//   const quoteCurrency = threadData.rfq?.body.quoteCurrency;

//   function statusToString(status: Status): string {
//     if (status === Status.COMPLETED) {
//       return 'Completed';
//     } else if (status === Status.FAILED) {
//       return 'Failed';
//     } else {
//       return 'Pending';
//     }
//   }

//   return (
//     <>
//       <ul className="space-y-6">
//         <li key={rfqMsg.id} className="relative flex gap-x-4">
//           <div
//             className={classNames(
//               '-bottom-6',
//               'absolute left-0 top-0 flex w-6 justify-center'
//             )}
//           >
//             {((threadData.orderStatuses &&
//               threadData.orderStatuses.length > 0) ||
//               threadData.quote) && (
//               <div
//                 className={classNames(
//                   '-bottom-6',
//                   'absolute left-0 top-0 flex w-6 justify-center'
//                 )}
//               >
//                 <div className="w-px bg-indigo-600" />
//               </div>
//             )}
//           </div>
//           <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
//             <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 ring-1 ring-indigo-600" />
//           </div>
//           <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
//             {'You requested '}
//             <span className="font-medium text-gray-300">{baseCurrency}</span>
//             {' for '}
//             <span className="font-medium text-gray-300">
//               {amount + ' ' + quoteCurrency}
//             </span>
//             .
//           </p>
//           <div className="flex-none py-0.5 text-xs leading-5 text-gray-500">
//             {dayjs(rfqMsg.createdTime).fromNow(true)} ago
//           </div>
//         </li>
//         {threadData.orderStatuses &&
//           threadData.orderStatuses?.map((orderStatus, index) => (
//             <li key={orderStatus.id} className="relative flex gap-x-4">
//               <div
//                 className={classNames(
//                   threadData.orderStatuses &&
//                     index === threadData.orderStatuses.length - 1 &&
//                     !threadData.quote
//                     ? 'h-6'
//                     : '-bottom-6',
//                   'absolute left-0 top-0 flex w-6 justify-center'
//                 )}
//               >
//                 <div className="w-px bg-indigo-600" />
//               </div>
//               <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
//                 {threadData.orderStatuses &&
//                 index === threadData.orderStatuses.length - 1 &&
//                 !threadData.quote ? (
//                   <ClockIcon
//                     className="h-6 w-6 text-indigo-600"
//                     aria-hidden="true"
//                   />
//                 ) : (
//                   <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 ring-1 ring-indigo-600" />
//                 )}
//               </div>
//               <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
//                 Order status updated to{' '}
//                 <span className="font-medium text-gray-300">
//                   {statusToString(orderStatus.body.orderStatus)}
//                 </span>
//                 .
//               </p>
//               <div className="flex-none py-0.5 text-xs leading-5 text-gray-500">
//                 {dayjs(orderStatus.createdTime).fromNow(true)} ago
//               </div>
//             </li>
//           ))}
//         {threadData.quote && (
//           <li key={threadData.quote.id} className="relative flex gap-x-4">
//             <div
//               className={classNames(
//                 false ? 'h-6' : '-bottom-6',
//                 'absolute left-0 top-0 flex w-6 justify-center'
//               )}
//             >
//               <div className="w-px bg-indigo-600" />
//             </div>
//             <div className="relative flex h-6 w-6 flex-none items-center justify-center bg-neutral-900">
//               {false ? (
//                 <CheckCircleIcon
//                   className="h-6 w-6 text-indigo-600"
//                   aria-hidden="true"
//                 />
//               ) : (
//                 <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 ring-1 ring-indigo-600" />
//               )}
//             </div>
//             <p className="flex-auto py-0.5 text-xs leading-5 text-gray-500">
//               {'PFI offered '}
//               <span className="font-medium text-gray-300">
//                 {threadData.quote.body.amount + ' ' + baseCurrency}
//               </span>{' '}
//               for{' '}
//               <span className="font-medium text-gray-300">
//                 {threadData.quote.body.totalFee + ' ' + quoteCurrency}
//               </span>
//               .
//             </p>
//             <time
//               dateTime={threadData.quote.createdTime}
//               className="flex-none py-0.5 text-xs leading-5 text-gray-500"
//             >
//               {dayjs(threadData.quote.createdTime).fromNow(true)} ago
//             </time>
//           </li>
//         )}
//       </ul>

//       {threadData.quote && (
//         <div className="mt-6 flex gap-x-3">
//           <ExclamationCircleIcon className="h-6 w-6 flex-none rounded-full text-indigo-600" />

//           <div className="relative flex-auto rounded-md py-1 px-2 text-xs font-medium ring-1 ring-gray-300">
//             <QuoteCard
//               threadData={threadData}
//               baseCurrency={baseCurrency}
//               quoteCurrency={quoteCurrency}
//               handleAction={handleRespondToQuote}
//             ></QuoteCard>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
