import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { ThreadData } from '../threads/ThreadManager';
import { PaymentInstructions } from '@tbd54566975/tbdex';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type QuoteCardProps = {
  threadData: ThreadData;
  baseCurrency: string;
  quoteCurrency: string;
  handleAction: () => void;
};

function getPaymentInstructions(paymentInstructions?: PaymentInstructions) {
  const instructions: JSX.Element[] = [];

  if (paymentInstructions) {
    if (paymentInstructions.payin) {
      const payin = paymentInstructions.payin;
      if (payin.instruction && payin.link) {
        instructions.push(
          <dd
            key="payin-instruction-link"
            className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
          >
            {payin.instruction}:{' '}
            <span className="text-indigo-600">{payin.link}</span>
          </dd>
        );
      } else if (payin.instruction) {
        instructions.push(
          <dd
            key="payin-instruction"
            className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
          >
            {payin.instruction}
          </dd>
        );
      } else if (payin.link) {
        instructions.push(
          <dd
            key="payin-link"
            className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
          >
            <span className="text-indigo-600">{payin.link}</span>
          </dd>
        );
      }
    }

    if (paymentInstructions.payout) {
      const payout = paymentInstructions.payout;
      if (payout.instruction && payout.link) {
        instructions.push(
          <dd
            key="payout-instruction-link"
            className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
          >
            {payout.instruction}:{' '}
            <span className="text-indigo-600">{payout.link}</span>
          </dd>
        );
      } else if (payout.instruction) {
        instructions.push(
          <dd
            key="payout-instruction"
            className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
          >
            {payout.instruction}
          </dd>
        );
      } else if (payout.link) {
        instructions.push(
          <dd
            key="payout-link"
            className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0"
          >
            <span className="text-indigo-600">{payout.link}</span>
          </dd>
        );
      }
    }
  }

  return instructions.length > 0 ? <div>{instructions}</div> : null;
}

//TODO: maybe get rid of the pending status when a quote comes back
export function QuoteCard({
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
          <div className="flex items-center">
            <h3 className="text-base font-semibold leading-7 text-gray-300">
              {quoteCurrency}
            </h3>
            <ArrowsRightLeftIcon className="h-5 w-5 text-gray-400 ml-1 mr-1" />
            <h3 className="text-base font-semibold leading-7 text-gray-300">
              {baseCurrency}
            </h3>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-red-500">
            Expires in{' '}
            {dayjs(quote?.body.expiryTime).fromNow(true) ??
              'No description available'}
          </p>
        </div>
        <div onClick={() => handleAction()}>
          <div className="flex items-center">
            <div className="text-indigo-600 text-sm">Pay</div>
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
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">
              Payment Instructions
            </dt>
            {getPaymentInstructions(quote?.body.paymentInstructions) !==
            null ? (
              getPaymentInstructions(quote?.body.paymentInstructions)
            ) : (
              <p className="text-gray-400">No additional instructions</p>
            )}
          </div>
        </dl>
      </div>
    </div>
  );
}
