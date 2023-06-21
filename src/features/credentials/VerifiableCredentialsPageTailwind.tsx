import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';

type Statuses = {
  [key: string]: string;
};

const statuses: Statuses = {
  Active: 'text-green-700 bg-green-50 ring-green-600/20',
  Invalid: 'text-gray-600 bg-gray-50 ring-gray-500/10',
  Expired: 'text-red-700 bg-red-50 ring-red-600/10',
};
const credentials = [
  {
    id: 1,
    name: 'Tuple',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/tuple.svg',
    type: 'KYC',
    expiration: {
      date: 'December 13, 2022',
      dateTime: '2022-12-13',
      status: 'Active',
    },
  },
  {
    id: 2,
    name: 'SavvyCal',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/savvycal.svg',
    type: 'KYC',
    expiration: {
      date: 'January 22, 2023',
      dateTime: '2023-01-22',
      status: 'Invalid',
    },
  },
  {
    id: 3,
    name: 'Reform',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    type: 'KYC',
    expiration: {
      date: 'January 23, 2023',
      dateTime: '2023-01-23',
      status: 'Expired',
    },
  },
  {
    id: 4,
    name: 'Tuple',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/tuple.svg',
    type: 'KYC',
    expiration: {
      date: 'December 13, 2022',
      dateTime: '2022-12-13',
      status: 'Active',
    },
  },
  {
    id: 5,
    name: 'SavvyCal',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/savvycal.svg',
    type: 'KYC',
    expiration: {
      date: 'January 22, 2023',
      dateTime: '2023-01-22',
      status: 'Invalid',
    },
  },
  {
    id: 6,
    name: 'Reform',
    imageUrl: 'https://tailwindui.com/img/logos/48x48/reform.svg',
    type: 'KYC',
    expiration: {
      date: 'January 23, 2023',
      dateTime: '2023-01-23',
      status: 'Expired',
    },
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function VerifiableCredentialsPageTailwind() {
  return (
    <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      {credentials.map((credential) => (
        <li
          key={credential.id}
          className="overflow-hidden rounded-xl border border-gray-200"
        >
          <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
            <img
              src={credential.imageUrl}
              alt={credential.name}
              className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
            />
            <div className="text-sm font-medium leading-6 text-gray-900">
              {credential.name}
            </div>
            <Menu as="div" className="relative ml-auto">
              <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Open options</span>
                <EllipsisHorizontalIcon
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/"
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        View<span className="sr-only">, {credential.name}</span>
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/"
                        className={classNames(
                          active ? 'bg-gray-50' : '',
                          'block px-3 py-1 text-sm leading-6 text-gray-900'
                        )}
                      >
                        Edit<span className="sr-only">, {credential.name}</span>
                      </Link>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Type</dt>
              <dd className="text-gray-700">
                <div className="font-medium text-gray-900">
                  {credential.type}
                </div>
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Status</dt>
              <dd className="flex items-start gap-x-2">
                <div className="font-medium text-gray-900"></div>
                <div
                  className={classNames(
                    statuses[credential.expiration.status],
                    'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset'
                  )}
                >
                  {credential.expiration.status}
                </div>
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
