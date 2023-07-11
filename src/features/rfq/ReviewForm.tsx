import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { SelectVcFormData } from './SelectVcForm';
import { ExchangeFormData } from './ExchangeForm';
import { SelectedPaymentMethodData } from './PaymentForm';
import { formatPaymentMethod } from '../../utils/TbdexUtils';

type ReviewFormProps = {
  exchangeData: ExchangeFormData;
  paymentData: Partial<SelectedPaymentMethodData>;
  vcData: SelectVcFormData;
  onSubmit: (formData: any) => void;
  onBack: (formData: any) => void;
};

export function ReviewForm({
  exchangeData,
  paymentData,
  vcData,
  onSubmit,
  onBack,
}: ReviewFormProps) {
  const handleNext = () => {
    onSubmit(undefined);
  };

  const handleBack = () => {
    onBack(undefined);
  };

  return (
    <>
      <div className="mt-4 pl-8 pr-8">
        <div className="pb-2">
          <h2 className="block text-sm font-medium leading-6 text-white">
            Exchange Details
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-300">
            {Object.entries(exchangeData).map(([key, value]) => (
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
              {Object.entries(paymentData).map(([key, value]) => (
                <div key={key}>
                  <span>{key}: </span>
                  <span>{formatPaymentMethod(value)}</span>
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
      </div>
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
          onClick={handleNext}
        >
          Submit
        </button>
      </div>
    </>
  );
}
