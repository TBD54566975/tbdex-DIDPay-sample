import { ArrowsRightLeftIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { getPaymentInstructions } from '../../utils/TbdexUtils';
import {
  Offering,
  PaymentInstructions,
  TbDEXMessage,
} from '@tbd54566975/tbdex';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type QuoteCardProps = {
  quoteMsg?: TbDEXMessage<'quote'>;
  offering?: Offering;
  onClick: () => void;
};

//TODO: maybe get rid of the pending status when a quote comes back
export function QuoteCard({ quoteMsg, offering, onClick }: QuoteCardProps) {
  const quote = quoteMsg?.body;

  return !quote ? null : (
    <div className="overflow-hidden bg-neutral-900 shadow sm:rounded-lg">
      <div className="px-4 py-6 sm:px-6 flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <h3 className="text-base font-semibold leading-7 text-gray-300">
              {offering?.quoteCurrency}
            </h3>
            <ArrowsRightLeftIcon className="h-5 w-5 text-gray-400 ml-1 mr-1" />
            <h3 className="text-base font-semibold leading-7 text-gray-300">
              {offering?.baseCurrency}
            </h3>
          </div>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-red-500">
            Expires in{' '}
            {dayjs(quote.expiryTime).fromNow(true) ??
              'No description available'}
          </p>
        </div>
        <div onClick={() => onClick()}>
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
              {quote.totalFeeCents} {offering?.quoteCurrency}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">Amount</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-400 sm:col-span-2 sm:mt-0">
              {quote.amountCents} {offering?.baseCurrency}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-300">
              Payment Instructions
            </dt>
            {getPaymentInstructions(quote.paymentInstructions) !== null ? (
              getPaymentInstructions(quote.paymentInstructions)
            ) : (
              <p className="text-gray-400">No additional instructions</p>
            )}
          </div>
        </dl>
      </div>
    </div>
  );
}
