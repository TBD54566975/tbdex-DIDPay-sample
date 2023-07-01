import { Fragment, useState, useEffect, useRef } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { Offering } from '@tbd54566975/tbdex';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import { useWeb5Context } from '../../context/Web5Context';
import { fakeOfferings } from '../FakeObjects';

export function OfferingsSearch() {
  const [pfiDid, setPfiDid] = useState('');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const { web5, profile } = useWeb5Context();

  const navigate = useNavigate();

  const handleComboboxChange = (offering: Offering) => {
    const selectedOffering = [offering];
    navigate('/offerings', { state: { offerings: selectedOffering } });
    setOpen(false);
  };

  const handleInputChange = (event: { target: { value: any } }) => {
    const value = event.target.value;
    setQuery(value);
    setPfiDid(value);
  };

  const handleEnter = () => {
    // only query dwn if pfiDid starts with did:ion:
    if (/^did:ion:/.test(pfiDid)) {
      getOfferings();
      setOpen(false);
    } else {
    }
  };

  //TODO: also need to handle searching for pfi by did
  const filteredOfferings =
    query === ''
      ? []
      : fakeOfferings.filter((offering: Offering) => {
          const baseCurrency = offering.baseCurrency
            .toLowerCase()
            .includes(query.toLowerCase());

          const quoteCurrency = offering.quoteCurrency
            .toLowerCase()
            .includes(query.toLowerCase());

          return baseCurrency || quoteCurrency;
        });

  async function getOfferings() {
    console.log('DO I EVEN GET HERE');
    // TODO: replace with pfiDid
    const { records } = await web5.dwn.records.query({
      // from: pfiDid,
      from: 'did:ion:EiB1rtmnzpHDkTgVPkx9wUbS_OrtF5yIJEpICsZlsHq86g:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJhdXRoeiIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJ2UGlPYTVtMXhzQXI3NUVVN2pDVE9PeU9tYk5ocjEwNHVoUkR5YnBfcmM0IiwieSI6InlqMzdUT0RiQjUwbkVtZnFfb3JNVEpDM2lHNXh5Wk9LaXBhbGFzWW85NW8ifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6Ikpzb25XZWJLZXkyMDIwIn0seyJpZCI6ImVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiI1NGxqSXhiSFlBYjdtVnF0S2x3YmdBTEJCOUQwLUJiN1loVG9rNnJSZkdFIiwieSI6IjRqam80RDFzbHY5b3BGeTlDVWVtbGV2TklDYXRjV2huR1d6Q1NIa0VlbXMifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7Im1lc3NhZ2VBdXRob3JpemF0aW9uS2V5cyI6WyIjYXV0aHoiXSwibm9kZXMiOlsiaHR0cHM6Ly9kd24udGJkZGV2Lm9yZy9kd241IiwiaHR0cHM6Ly9kd24udGJkZGV2Lm9yZy9kd24zIl0sInJlY29yZEVuY3J5cHRpb25LZXlzIjpbIiNlbmMiXX0sInR5cGUiOiJEZWNlbnRyYWxpemVkV2ViTm9kZSJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQzdMVjc1QkFRVkpaaDh3ZFpOZkk2LUlNTzJ3Vm5UTWk4SVlPUUt4aHpmbncifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUFuRE9PalVzVkFUbE5uS3RxbUl4dzVKUDZocFUtSWpqWHItdWJMN1RFWTRRIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlCZEk0VEFEUUdZSVRnMHlQR2ZMS1U1X2lYQndicWlfQ2FkaElkRThxWkNuQSJ9fQ',
      message: {
        filter: {
          schema: 'https://tbdex.io/schemas/offering',
        },
      },
    });

    if (Array.isArray(records)) {
      const offerings = await Promise.all(
        records.map(async (record) => {
          const tbdexMsg = await record.data.json();
          return tbdexMsg;
        }) ?? []
      );
      navigate('/offerings', { state: { offerings: offerings } });
    } else {
      // Handle the case where records is not an array
      // throw an error, log a warning
      alert('RECORDS IS NOT AN ARRAY');
    }
  }

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
                          placeholder="Enter a DID or Currency..."
                          onChange={handleInputChange}
                          onKeyDown={(event) => {
                            // Listen for enter key
                            if (event.key === 'Enter') {
                              handleEnter();
                            }
                          }}
                        />
                      </div>

                      {filteredOfferings.length > 0 ? (
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
                                key={offering.id}
                                value={offering}
                                className={({ active }) =>
                                  classNames(
                                    'cursor-default select-none px-4 py-2',
                                    active && 'bg-indigo-600 text-white'
                                  )
                                }
                              >
                                ({offering.description}) {rate}
                              </Combobox.Option>
                            );
                          })}
                        </Combobox.Options>
                      ) : (
                        <Combobox.Options
                          static
                          className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-300"
                        >
                          <Combobox.Option
                            key="no-options"
                            value=""
                            className="cursor-default select-none px-4 py-2 text-gray-500"
                            disabled
                          >
                            DID must begin with{' '}
                            <span className="text-indigo-600">did:ion:</span>...
                          </Combobox.Option>
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
