import React, { Fragment } from 'react'
import validator from '@rjsf/validator-ajv8'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { PaymentMethod } from '@tbd54566975/tbdex'
import { classNames } from '../utils/tailwind-utils'
import { formatPaymentMethodKind } from './PaymentUtils'
import { JsonSchemaForm } from './JsonSchemaForm'

type PaymentDropdownProps = {
  header: string;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: PaymentMethod;
  paymentDetails: Partial<{ [key: string]: any }>;
  setSelectedPaymentMethod: (pm: PaymentMethod) => void;
  setPaymentDetails: (pd: any) => void;
}

export function PaymentDropdown(props: PaymentDropdownProps) {
  const handleSelectItem = (paymentMethod: PaymentMethod) => {
    props.setSelectedPaymentMethod(paymentMethod)
  }

  return (
    <div>
      <Listbox value={props.selectedPaymentMethod} onChange={(paymentMethod) => handleSelectItem(paymentMethod)}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium leading-6 text-white">
              {props.header}
            </Listbox.Label>
            <div className="relative mt-2">
              <Listbox.Button className="relative w-full cursor-default rounded-md bg-neutral-900 py-1.5 pl-3 pr-10 text-left text-white shadow-sm ring-1 ring-inset ring-transparent focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <span className="flex items-center">
                  <span className="ml-3 block truncate">
                    {formatPaymentMethodKind(props.selectedPaymentMethod.kind)}
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
                <Listbox.Options className="absolute z-10 mt-1 w-full overflow-y-auto rounded-md bg-neutral-800 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {props.paymentMethods.map((method, index) => (
                    <Listbox.Option
                      key={index}
                      className={({ active }) =>
                        classNames(
                          active ? 'bg-indigo-600 text-gray-300' : 'text-white',
                          'relative cursor-default select-none py-2 pl-3 pr-9'
                        )
                      }
                      value={method}
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
                              {formatPaymentMethodKind(method.kind)}
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

              {props.selectedPaymentMethod.requiredPaymentDetails ? (
                <JsonSchemaForm
                  validator={validator}
                  schema={
                    props.selectedPaymentMethod.requiredPaymentDetails as any
                  }
                  formData={props.paymentDetails}
                  onChange={(e) => props.setPaymentDetails(e.formData)}
                />
              ) : (
                <></>
              )}
            </div>
          </>
        )}
      </Listbox>
    </div>
  )
}
