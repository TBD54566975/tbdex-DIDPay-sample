import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/solid';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { QuoteCard } from '../quotes/QuoteCard';
import { TbDEXMessage, Status } from '@tbd54566975/tbdex';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useEffect, useState } from 'react';
import { useWeb5Context } from '../../context/Web5Context';
import { queryChildRecords } from '../Web5Utils';
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
  const handlePay = () => {
    const url = quoteMsg?.body.paymentInstructions?.payin?.link || '';
    window.open(url, '_blank', 'noreferrer');
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      setRfqMsg((await recordThread.rfq?.data.json()) as TbDEXMessage<'rfq'>);

      if (!recordThread.quote) {
        const records = await queryChildRecords(web5, recordThread.rfq);
        if (records && records[0]) {
          setRecordThread({ ...recordThread, quote: records[0] });
          setQuoteMsg((await records[0].data.json()) as TbDEXMessage<'quote'>);
        }
      } else if (recordThread.orderStatuses.length < 2) {
        // kw: you could make this more robust, instead of hard coding 2
        // OrderStatus: PENDING -> FAILED|COMPLETED
        const records = await queryChildRecords(web5, recordThread.quote);
        if (records) {
          setRecordThread({ ...recordThread, orderStatuses: records });
        }
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }, []); // state var can go here to restart the interval

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
              handleAction={handlePay}
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
