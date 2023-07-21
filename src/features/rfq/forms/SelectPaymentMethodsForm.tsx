import React, { useContext } from 'react'
import { PaymentDropdown } from '../../../components/PaymentDropdown'
import { RfqContext } from '../../../context/RfqContext'

type PaymentFormProps = {
  onNext: () => void;
  onBack: () => void;
}

export function SelectPaymentMethodsForm(props: PaymentFormProps) {  
  const {
    offering,
    selectedPayinMethod,
    setSelectedPayinMethod,
    payinDetails,
    setPayinDetails,
    selectedPayoutMethod,
    setSelectedPayoutMethod,
    payoutDetails,
    setPayoutDetails
  } = useContext(RfqContext)

  return (
    <>
      <div className="mt-8 mb-8 pl-8 pr-8">
        <div className="mt-8">
          <PaymentDropdown
            header="Pay-in instrument"
            selectedPaymentMethod={selectedPayinMethod}
            setSelectedPaymentMethod={setSelectedPayinMethod}
            paymentDetails={payinDetails}
            setPaymentDetails={setPayinDetails}
            paymentMethods={offering.payinMethods}
          ></PaymentDropdown>
        </div>

        <div className="mt-4">
          <PaymentDropdown
            header="Pay-out instrument"
            selectedPaymentMethod={selectedPayoutMethod}
            setSelectedPaymentMethod={setSelectedPayoutMethod}
            paymentDetails={payoutDetails}
            setPaymentDetails={setPayoutDetails}
            paymentMethods={offering.payoutMethods}
          ></PaymentDropdown>
        </div>
      </div>
      <div className="mt-12 pl-8 pr-8 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-white"
          onClick={props.onBack}
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={props.onNext}
        >
          Next
        </button>
      </div>
    </>
  )
}
