import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Offering, PaymentMethodKind, PaymentMethod } from '@tbd54566975/tbdex';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type PaymentDropdownProps = {
  header: string;
  paymentMethods: PaymentMethod[];
  paymentMethodKind: string;
  onChange: (newValue: PaymentMethodKind) => void;
};

export type PaymentFormData = {
  payinInstrument: string;
  payoutInstrument: string;
};

type PaymentFormProps = {
  offering: Offering;
  paymentData: PaymentFormData;
  onSubmit: (formData: PaymentFormData) => void;
  onBack: (formData: PaymentFormData) => void;
};

function PaymentDropdown({
  header,
  paymentMethods,
  paymentMethodKind,
  onChange,
}: PaymentDropdownProps) {
  const [selected, setSelected] = useState(
    paymentMethods.find((method) => method.kind === paymentMethodKind)?.kind ||
      paymentMethods[0].kind
  );

  const handleSelectItem = (paymentMethodKind: PaymentMethodKind) => {
    setSelected(paymentMethodKind);
    onChange(paymentMethodKind);
  };

  return (
    <div>
      <Listbox value={selected} onChange={handleSelectItem}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-white">
              {header}
            </Listbox.Label>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-neutral-900 py-1.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <span className="flex items-center">
                  <span className="ml-3 block truncate">{selected}</span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 w-full overflow-y-auto rounded-md bg-neutral-900 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {paymentMethods.map((method, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-indigo-600 text-gray-300' : 'text-white',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={method.kind}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={classNames(
                                selected ? 'font-semibold' : 'font-normal',
                                'ml-3 block truncate'
                              )}
                            >
                              {method.kind}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? 'text-white' : 'text-indigo-600',
                                'absolute inset-y-0 right-0 flex items-center pr-4'
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
}

export function PaymentForm({
  offering,
  paymentData,
  onSubmit,
  onBack,
}: PaymentFormProps) {
  const [payinInstrument, setPayinInstrument] = useState(
    paymentData.payinInstrument
  );
  const [payoutInstrument, setPayoutInstrument] = useState(
    paymentData.payoutInstrument
  );

  const handleNext = () => {
    const formData: PaymentFormData = {
      payinInstrument,
      payoutInstrument,
    };
    onSubmit(formData);
  };

  const handleBack = () => {
    const formData: PaymentFormData = {
      payinInstrument,
      payoutInstrument,
    };
    onBack(formData);
  };

  return (
    <>
      <div className="mt-8 mb-8 pl-8 pr-8">
        <div className="mt-8">
          <PaymentDropdown
            header="Pay-in instrument"
            paymentMethods={offering.payinMethods}
            paymentMethodKind={payinInstrument}
            onChange={setPayinInstrument}
          ></PaymentDropdown>
        </div>

        <div className="mt-4">
          <PaymentDropdown
            header="Pay-out instrument"
            paymentMethods={offering.payoutMethods}
            paymentMethodKind={payoutInstrument}
            onChange={setPayoutInstrument}
          ></PaymentDropdown>
        </div>
      </div>
      <div className="mt-12 pl-8 pr-8 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-white"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </>
  );
}
