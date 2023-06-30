import { Fragment, useState, useEffect } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { Offering } from '@tbd54566975/tbdex';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import { offerings } from '../FakeObjects';

export function OfferingsSearch() {
  const [pfiDid, setPfiDid] = useState('');

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  // const isPatternValid = /^did:ion:/.test(pfiDid);

  const handlePfiDidChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPfiDid(event.target.value);
  };

  const handleGetOfferingsClick = async () => {
    // TODO: search for pfiDid offering
    // const { records } = await web5.dwn.records.query({
    //   from: pfiDid,
    //   message: {
    //     filter: {
    //       schema: 'https://tbdex.io/schemas/offering',
    //     },
    //   },
    // });

    // const offerings = await Promise.all(
    //   records?.map(async (r) => {
    //     return (await r.data.json()) as Offering;
    //   }) ?? []
    // );

    // setOfferings(offerings);
    // TODO: will need to change '/offering' state to accept multiple offerings
    // navigate('/offering', { state: { offering: offering } });
    navigate('/offerings');
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleGetOfferingsClick();
    }
  };

  const handleComboboxChange = (offering: Offering) => {
    navigate('/offering', { state: { offering: offering } });
    setOpen(false);
  };

  //TODO: also need to handle searching for pfi by did
  const filteredOfferings =
    query === ''
      ? []
      : offerings.filter((offering) => {
          const descriptionMatch = offering.description
            .toLowerCase()
            .includes(query.toLowerCase());

          const baseCurrency = offering.baseCurrency
            .toLowerCase()
            .includes(query.toLowerCase());

          const quoteCurrency = offering.quoteCurrency
            .toLowerCase()
            .includes(query.toLowerCase());

          return descriptionMatch || baseCurrency || quoteCurrency;
        });

  function getRate(
    unitPrice: string,
    quoteCurrency: string,
    baseCurrency: string
  ) {
    return `1 ${quoteCurrency} / ${unitPrice} ${baseCurrency}`;
  }

  function classNames(...classes: (string | boolean)[]) {
    return classes.filter(Boolean).join(' ');
  }

  useEffect(() => {
    const handleHotkey = (event: KeyboardEvent) => {
      if (event.key === 'k' && event.metaKey) {
        event.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };

    document.addEventListener('keydown', handleHotkey);

    return () => {
      document.removeEventListener('keydown', handleHotkey);
    };
  }, []);

  return (
    <>
      <div className="flex flex-1 items-center ml-auto gap-x-6">
        <div className="relative flex">
          <input
            className="block rounded-md w-full py-1.5 pl-3 pr-12 bg-neutral-900 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search..."
            onClick={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            onChange={handlePfiDidChange}
            style={{ outline: 'none', boxShadow: 'none' }}
            readOnly
          />
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            <span className="hidden lg:inline-block">⌘K</span>
          </span>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="w-full">
          <Transition.Root
            show={open}
            as={Fragment}
            afterLeave={() => setQuery('')}
            appear
          >
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
              </Transition.Child>

              <div className=" lg:ml-72 fixed inset-0 z-10 overflow-y-auto p-4 sm:my-8 sm:mt-24 mt-24 text-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-neutral-900 shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
                    <Combobox
                      onChange={(offering: Offering) =>
                        handleComboboxChange(offering)
                      }
                    >
                      <div className="relative">
                        <MagnifyingGlassIcon
                          className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <Combobox.Input
                          className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                          placeholder="Enter a PFI or Currency..."
                          onChange={(event) => {
                            setQuery(event.target.value);
                          }}
                        />
                      </div>

                      {filteredOfferings.length > 0 && (
                        <Combobox.Options
                          static
                          className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-300"
                        >
                          {filteredOfferings.map((offering) => {
                            const rate = getRate(
                              offering.unitPrice,
                              offering.baseCurrency,
                              offering.quoteCurrency
                            );

                            return (
                              <Combobox.Option
                                key={offering.description}
                                value={offering}
                                className={({ active }) =>
                                  classNames(
                                    'cursor-default select-none px-4 py-2',
                                    active && 'bg-indigo-600 text-white'
                                  )
                                }
                              >
                                ({offering.description}) {rate}{' '}
                                {/* {baseCurrency} / {quoteCurrency} ({priceRange}
                                ) */}
                              </Combobox.Option>
                            );
                          })}
                        </Combobox.Options>
                      )}
                    </Combobox>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>
        </div>
      </div>
    </>
  );
}
