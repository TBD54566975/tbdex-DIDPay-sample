import React, { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import { SelectVcFormData } from './SelectVcForm'
import { formatPaymentMethod } from '../../utils/TbdexUtils'

type ReviewFormProps = {
  // exchangeData: ExchangeFormData;
  // paymentData: Partial<SelectedPaymentMethodData>;
  // vcData: SelectVcFormData;
  onSubmit: () => void;
  onBack: () => void;
};

export function ReviewForm(props: ReviewFormProps) {
  const handleSubmit = () => {
    props.onSubmit()
  }

  const handleBack = () => {
    props.onBack()
  }

  return (
    <>
      {/* <div className="mt-4 pl-8 pr-8">
        <div className="pb-2">
          <h2 className="block text-sm font-medium leading-6 text-white">
            Exchange Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-300">
            {Object.entries(props.exchangeData).map(([key, value]) => (
              <div key={key}>
                <span>{key}: </span>
                <span>{value}</span>
              </div>
            ))}
          </p>
        </div>
        <div>
          <div className="pb-3">
            <h2 className="block text-sm font-medium leading-7 text-white">
              Payment Details
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-300">
              {Object.entries(props.paymentData).map(([key, value]) => (
                <div key={key}>
                  <span>{key}: </span>
                  <span>peepeepoopoo</span>
                </div>
              ))}{' '}
            </p>
          </div>
        </div>
        <div>
          <div className="pb-3">
            <h2 className="block text-sm font-medium leading-7 text-white">
              VC Details
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-300">
              {Object.entries(vcData).map(([key, value]) => (
                <div key={key}>
                  <span>{key}: </span>
                  <span>{value}</span>
                </div>
              ))}{' '}
            </p>
          </div>
        </div>
      </div> */}
      <div className="pl-8 pr-8 flex items-center justify-end gap-x-6">
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
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </>
  )
}
