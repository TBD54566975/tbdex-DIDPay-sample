import { Fragment, useState } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { Offering, PaymentMethodKind } from '@tbd54566975/tbdex';
import {
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

export function OfferingsSearch() {
  const [pfiDid, setPfiDid] = useState('');

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const handlePfiDidChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setPfiDid(event.target.value);
  };

  const handleGetOfferingsClick = async () => {
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
    navigate('offerings');
  };

  function generateUniqueId(): string {
    const timestamp: number = new Date().getTime();
    const randomId: string = Math.random().toString(36).substr(2, 9);
    return `${timestamp}-${randomId}`;
  }

  function generateRandomTimestamp(): string {
    const randomTimestamp = moment()
      .subtract(Math.floor(Math.random() * 12), 'months')
      .subtract(Math.floor(Math.random() * 30), 'days')
      .set('hour', Math.floor(Math.random() * 24))
      .set('minute', Math.floor(Math.random() * 60))
      .set('second', Math.floor(Math.random() * 60))
      .set('millisecond', Math.floor(Math.random() * 1000))
      .format('YYYY-MM-DDTHH:mm:ss.SSSSSSZ');

    return randomTimestamp;
  }

  const offerings: Offering[] = [
    {
      id: generateUniqueId(),
      description: 'TBD',
      baseCurrency: 'BTC',
      quoteCurrency: 'USD',
      unitPrice: '30025.50',
      baseFee: '15',
      min: '100',
      max: '20000',
      kycRequirements: 'string',
      payinMethods: [
        {
          kind: PaymentMethodKind.DEBIT_CARD,
          paymentPresentationRequestJwt: 'string',
        },
        {
          kind: PaymentMethodKind.SQUARE_PAY,
          paymentPresentationRequestJwt: 'string',
        },
      ],
      payoutMethods: [
        {
          kind: PaymentMethodKind.BITCOIN_ADDRESS,
          paymentPresentationRequestJwt: 'string',
          fee: {
            flatFee: '5',
          },
        },
      ],
      createdTime: generateRandomTimestamp(),
    },
    {
      id: generateUniqueId(),
      description: 'TBD',
      baseCurrency: 'BTC',
      quoteCurrency: 'MXN',
      unitPrice: '514279.77',
      baseFee: '235',
      min: '1000',
      max: '400000',
      kycRequirements: 'string',
      payinMethods: [
        {
          kind: PaymentMethodKind.DEBIT_CARD,
          paymentPresentationRequestJwt: 'string',
          fee: {
            flatFee: '20',
          },
        },
      ],
      payoutMethods: [
        {
          kind: PaymentMethodKind.BITCOIN_ADDRESS,
          paymentPresentationRequestJwt: 'string',
          fee: {
            flatFee: '10',
          },
        },
      ],
      createdTime: generateRandomTimestamp(),
    },
    {
      id: generateUniqueId(),
      description: 'TBD',
      baseCurrency: 'USD',
      quoteCurrency: 'GHA',
      unitPrice: '11.3',
      baseFee: '2',
      min: '10',
      max: '950',
      kycRequirements: 'string',
      payinMethods: [
        {
          kind: PaymentMethodKind.DEBIT_CARD,
          paymentPresentationRequestJwt: 'string',
        },
        {
          kind: PaymentMethodKind.SQUARE_PAY,
          paymentPresentationRequestJwt: 'string',
          fee: {
            flatFee: '8',
          },
        },
      ],
      payoutMethods: [
        {
          kind: PaymentMethodKind.BITCOIN_ADDRESS,
          paymentPresentationRequestJwt: 'string',
          fee: {
            flatFee: '45',
          },
        },
      ],
      createdTime: generateRandomTimestamp(),
    },
    {
      id: generateUniqueId(),
      description: 'TBD',
      baseCurrency: 'BTC',
      quoteCurrency: 'GHA',
      unitPrice: '339288.15',
      baseFee: '175',
      min: '900',
      max: '9000',
      kycRequirements: 'string',
      payinMethods: [
        {
          kind: PaymentMethodKind.DEBIT_CARD,
          paymentPresentationRequestJwt: 'string',
          fee: {
            flatFee: '30',
          },
        },
      ],
      payoutMethods: [
        {
          kind: PaymentMethodKind.BITCOIN_ADDRESS,
          paymentPresentationRequestJwt: 'string',
          fee: {
            flatFee: '50',
          },
        },
      ],
      createdTime: generateRandomTimestamp(),
    },
  ];

  const isPatternValid = /^did:ion:/.test(pfiDid);

  const showError = () => {
    return !isPatternValid && pfiDid.length > 0;
  };

  const handleKeyDown = (event: { key: string }) => {
    if (event.key === 'Enter') {
      handleGetOfferingsClick();
    }
    navigate('/offerings');
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

  function getPriceRange(min: string, max: string, quoteCurrency: string) {
    return `${min} ${quoteCurrency} - ${max} ${quoteCurrency}`;
  }

  function getBaseFee(baseFee: string, quoteCurrency: string) {
    return `${baseFee} ${quoteCurrency} fee`;
  }

  function classNames(...classes: (string | boolean)[]) {
    return classes.filter(Boolean).join(' ');
  }

  return (
    <>
      <div className="flex flex-1 items-center ml-auto gap-x-6">
        <div className="relative flex">
          <input
            className="block rounded-md w-full py-1.5 pl-3 pr-12 bg-neutral-900 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm"
            placeholder="Search..."
            onClick={() => setOpen(true)}
            // onKeyDown={handleKeyDown}
            // onChange={handlePfiDidChange}
            style={{ outline: 'none', boxShadow: 'none' }}
            readOnly
          />
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
