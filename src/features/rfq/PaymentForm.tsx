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
  onChange: (newValue: SelectedPaymentMethodData) => void;
};

export type SelectedPaymentMethodData = {
  kind: string;
  details?: any;
};

type PaymentFormProps = {
  offering: Offering;
  setSelectedPayinData: (selectedPayinData: SelectedPaymentMethodData) => void;
  setSelectedPayoutData: (
    selectedPayoutData: SelectedPaymentMethodData
  ) => void;
  onSubmit: (formData: SelectedPaymentMethodData) => void;
  onBack: (formData: SelectedPaymentMethodData) => void;
};

function PaymentDropdown({
  header,
  paymentMethods,
  onChange,
}: PaymentDropdownProps) {
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);

  const handleSelectItem = (paymentMethod: PaymentMethod) => {
    setSelectedMethod(paymentMethod);
    onChange(paymentMethod);
  };

  const schema = selectedMethod.requiredPaymentDetails;

  return (
    <div>
      <Listbox
        value={selectedMethod}
        onChange={(paymentMethod) => handleSelectItem(paymentMethod)}
      >
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-white">
              {header}
            </Listbox.Label>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-neutral-900 py-1.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <span className="flex items-center">
                  <span className="ml-3 block truncate">
                    {selectedMethod.kind}
                  </span>
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
  setSelectedPayinData,
  setSelectedPayoutData,
  onSubmit,
  onBack,
}: PaymentFormProps) {
  const handleNext = () => {
    // const formData: SelectedPaymentMethodData = {
    //   payinInstrument,
    //   payoutInstrument,
    // };
    onSubmit(undefined as any);
  };

  const handleBack = () => {
    // const formData: PaymentFormData = {
    //   payinInstrument,
    //   payoutInstrument,
    // };
    onBack(undefined as any);
  };

  return (
    <>
      <div className="mt-8 mb-8 pl-8 pr-8">
        <div className="mt-8">
          <PaymentDropdown
            header="Pay-in instrument"
            paymentMethods={offering.payinMethods}
            onChange={setSelectedPayinData}
          ></PaymentDropdown>
        </div>

        <div className="mt-4">
          <PaymentDropdown
            header="Pay-out instrument"
            paymentMethods={offering.payoutMethods}
            onChange={setSelectedPayoutData}
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
