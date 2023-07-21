import React, { useContext } from 'react'
import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Offering } from '@tbd54566975/tbdex'
import { ReviewForm } from './forms/ReviewForm'
import { SelectPaymentMethodsForm } from './forms/SelectPaymentMethodsForm'
import { SetQuoteAmountForm } from './forms/SetQuoteAmountForm'
import { ProgressPanel, Step } from './ProgressPanel'
import { CreateVcForm } from './forms/CreateVcForm'
import { RfqContext } from '../../context/RfqContext'
import { useWeb5Context } from '../../context/Web5Context'
import { createRfq } from '../../utils/web5-utils'

type RfqModalProps = {
  offering: Offering;
  pfiDid: string;
  isOpen: boolean;
  onClose: (hasSubmitted: boolean) => void;
}

export function RfqModal({ offering, pfiDid, isOpen, onClose }: RfqModalProps) {
  const { web5, profile } = useWeb5Context()
  const [step, setStep] = useState(0)
  const {
    quoteAmount,
    kycProof,
    selectedPayinMethod,
    selectedPayoutMethod,
    payoutDetails,
  } = useContext(RfqContext) 
  
  const steps: Step[] = [
    { name: 'Desired Amount', status: 'complete' },
    { name: 'Payment Methods', status: 'current' },
    { name: 'Verifiable Credential', status: 'upcoming' },
    { name: 'Review', status: 'upcoming' },
  ]

  const handleNextStep = async () => {
    if (step === 3) {
      createRfq(web5, offering, profile.id, pfiDid, quoteAmount, kycProof, selectedPayinMethod.kind, selectedPayoutMethod.kind, payoutDetails)
      onClose(true)
    }

    setStep((prevStep) => prevStep + 1)
  }
    
  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1)
  }

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z" onClose={onClose}>
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

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex justify-center p-8 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className={'relative transform overflow-hidden rounded-lg bg-black pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:mt-24 mt-24 w-full lg:ml-72'}
                >
                  <ProgressPanel steps={steps} currentStep={step} />
                  {step === 0 && (
                    <SetQuoteAmountForm
                      onNext={handleNextStep}
                    />
                  )}
                  {step === 1 && (
                    <SelectPaymentMethodsForm
                      onNext={handleNextStep}
                      onBack={handlePreviousStep}
                    />
                  )}
                  {step === 2 && (
                    <CreateVcForm
                      onNext={handleNextStep}
                      onBack={handlePreviousStep}
                    />
                  )}
                  {step === 3 && (                    
                    <ReviewForm
                      onSubmit={handleNextStep}
                      onBack={handlePreviousStep}
                    />
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
