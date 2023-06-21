import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Offering } from '../../tbDexTypes';

type Statuses = {
  [key: string]: string;
};

type Environments = {
  [key: string]: string;
};

const statuses: Statuses = {
  success: 'text-green-400 bg-green-400/10',
  pending: 'text-gray-400 bg-gray-400/10',
  failed: 'text-rose-400 bg-rose-400/10',
};
const quoteStatus: Environments = {
  Success: 'text-green-400 bg-green-400/10 ring-gray-400/20',
  Pending: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  Failed: 'text-rose-400 bg-rose-400/10 ring-gray-400/20',
};
const offerings = [
  {
    id: 1,
    href: '#',
    exchangePair: 'USD <> BTC',
    PFI: 'TBD',
    status: 'success',
    statusText: 'Initiated 1m 32s ago',
    description: '<more info about offering here>',
    environment: 'Success',
  },
  {
    id: 2,
    href: '#',
    exchangePair: 'BTC <> MEX',
    PFI: 'TBD',
    status: 'success',
    statusText: 'Deployed 3m ago',
    description: '<more info about offering here>',
    environment: 'Success',
  },
  {
    id: 3,
    href: '#',
    exchangePair: 'USD <> KEN',
    PFI: 'YellowCard',
    status: 'pending',
    statusText: 'Deployed 3h ago',
    description: '<more info about offering here>',
    environment: 'Pending',
  },
  {
    id: 4,
    href: '#',
    exchangePair: 'USD <> GHS',
    PFI: 'YellowCard',
    status: 'failed',
    statusText: 'Failed to deploy 6d ago',
    description: '<more info about offering here>',
    environment: 'Failed',
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function OrdersPageTailwind() {
  return (
    <ul className="divide-y divide-white/5">
      {offerings.map((offering) => (
        <li
          key={offering.id}
          className="relative flex items-center space-x-4 py-4"
        >
          <div className="min-w-0 flex-auto">
            <div className="flex items-center gap-x-3">
              <div
                className={classNames(
                  statuses[offering.status],
                  'flex-none rounded-full p-1'
                )}
              >
                <div className="h-2 w-2 rounded-full bg-current" />
              </div>
              <h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
                <a href={offering.href} className="flex gap-x-2">
                  <span className="truncate">"{offering.PFI}"</span>
                  <span className="text-gray-400">/</span>
                  <span className="whitespace-nowrap">
                    {offering.exchangePair}
                  </span>
                  <span className="absolute inset-0" />
                </a>
              </h2>
            </div>
            <div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
              <p className="truncate">{offering.description}</p>
              <svg
                viewBox="0 0 2 2"
                className="h-0.5 w-0.5 flex-none fill-gray-300"
              >
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className="whitespace-nowrap">{offering.statusText}</p>
            </div>
          </div>
          <div
            className={classNames(
              quoteStatus[offering.environment],
              'rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset'
            )}
          >
            {offering.environment}
          </div>
          <ChevronRightIcon
            className="h-5 w-5 flex-none text-gray-400"
            aria-hidden="true"
          />
        </li>
      ))}
    </ul>
  );
}
