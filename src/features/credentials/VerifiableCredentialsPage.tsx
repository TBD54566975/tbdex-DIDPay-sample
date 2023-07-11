import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisHorizontalIcon, PlusIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import { Credential, credentials } from '../rfq/FormTypes';

type Statuses = {
  [key: string]: string;
};

const statuses: Statuses = {
  green: 'text-green-700 bg-green-400/10 ring-green-600/20',
  gray: 'text-gray-600 bg-gray-400/10 ring-gray-500/10',
  red: 'text-red-700 bg-rose-400/10 ring-red-600/10',
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function VerifiableCredentialsPage() {
  return (
    <div className="relative min-h-screen">
      <ul className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8 pl-5 pr-5">
        {credentials.map((credential) => (
          <li
            key={credential.id}
            className="overflow-hidden rounded-xl border border-transparent"
          >
            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-neutral-900 p-6">
              <div className="text-sm font-medium leading-6 text-yellow-300">
                {credential.issuer.name}
              </div>
              <Menu as="div" className="relative ml-auto">
                <Menu.Button className="-m-2.5 block p-2.5 text-white hover:text-gray-500">
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
                  <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-neutral-800 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/"
                          className={classNames(
                            active ? 'bg-neutral-900' : '',
                            'block px-3 py-1 text-sm leading-6 text-white'
                          )}
                        >
                          Edit
                          <span className="sr-only">
                            , {credential.issuer.name}
                          </span>
                        </Link>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <Link
                          to="/"
                          className={classNames(
                            active ? 'bg-neutral-900' : '',
                            'block px-3 py-1 text-sm leading-6 text-red-500'
                          )}
                        >
                          Delete
                          <span className="sr-only">
                            , {credential.issuer.name}
                          </span>
                        </Link>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-neutral-900">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-white">Type</dt>
                <dd className="text-gray-700">
                  <div className="font-medium text-white">
                    {credential.type}
                  </div>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-white">Status</dt>
                <dd className="flex items-start gap-x-2">
                  <div className="font-medium text-gray-900"></div>
                  <div
                    className={classNames(
                      credential.type === 'VerifiableCredential'
                        ? statuses.green
                        : statuses.red,
                      'rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inse'
                    )}
                  >
                    {credential.type === 'VerifiableCredential'
                      ? 'Valid'
                      : 'Invalid'}
                  </div>
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="fixed bottom-6 right-6 rounded-full bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        <PlusIcon className="h-8 w-8" aria-hidden="true" />
      </button>
    </div>
  );
}
