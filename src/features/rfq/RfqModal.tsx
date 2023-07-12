import React, { useContext } from 'react'

import { Fragment, useState, createContext } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Offering, PaymentMethod } from '@tbd54566975/tbdex'

import { credentials } from './FormTypes'
import { ReviewForm } from './ReviewForm'
import { SelectPaymentMethodsForm } from './SelectPaymentMethodsForm'
import { CreateVcForm } from './CreateVcForm'
import { useWeb5Context } from '../../context/Web5Context'
import { ProgressPanel, steps } from './ProgressPanel'
import { SelectAmountForm } from './SelectAmountForm'
import { createRfq } from '../../utils/Web5Utils'
import { RfqContext } from '../../context/RfqContext'

type RfqModalProps = {
  offering: Offering;
  pfiDid: string;
  isOpen: boolean;
  onClose: (hasSubmitted: boolean) => void;
};


export function RfqModal({ offering, pfiDid, isOpen, onClose }: RfqModalProps) {
  const { profile, web5 } = useWeb5Context()

  const [step, setStep] = useState(0)
  // TODO: these dont need to be here, purely for logging
  const {
    quoteAmount,
    setQuoteAmount,
    selectedPayinMethod,
    setSelectedPayinMethod,
    selectedPayoutMethod,
    setSelectedPayoutMethod,
    selectedPayinKind,
    setSelectedPayinKind,
    payinDetails,
    setPayinDetails,
    selectedPayoutKind,
    setSelectedPayoutKind,
    payoutDetails,
    setPayoutDetails
  } = useContext(RfqContext)  

  const [vcs, setVcs] = useState([])

  const handleNextStep = async () => {
    if (step === 0) {
      // const exchangeFormData = formData as ExchangeFormData
      // setQuoteCurrencyAmount(exchangeFormData.amount)
      console.log(quoteAmount)
    } else if (step === 1) {
      console.log('done with step 1. RFQ so far')
      console.log({
        amount: quoteAmount,
        payinMethod: {
          kind: selectedPayinKind,
          paymentDetails: payinDetails
        },
        payoutMethod: {
          kind: selectedPayoutKind,
          paymentDetails: payoutDetails
        }
      })

      const { records, status } = await web5.dwn.records.query({
        message: {
          filter: {
            dataFormat: 'application/vc+ld+json'
          }
        }
      })

      if (status.code !== 200) {
        alert('UH OH spaghettios. check console for error')
        console.error(`(${status.code}) -> ${status.detail}`)

        return
      }

      const vcJwts = []
      for (const record of records) {
        const vc = await record.data.text()
        vcJwts.push(vc)
      }

      setVcs(vcJwts)
    } else if (step === 2) {
      // const vcFormData = formData as SelectVcFormData
      // setVcData(vcFormData)
      console.log('step 2 hehe')
      
    } else if (step === 3) {
      console.log('step 3 hehe')
    }

    setStep((prevStep) => prevStep + 1)
  }
    
  const handlePreviousStep = () => {
    if (step === 1) {
      console.log('hi step 1 previous step handler')
      // const paymentFormData = formData as PaymentFormData;
      // setPaymentData(paymentFormData);
    } else if (step === 2) {
      // const vcFormData = formData as SelectVcFormData
      // setVcData(vcFormData)
    }
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
                    <SelectAmountForm
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
                      vcs={vcs}
                      kycRequirements={offering.kycRequirements}
                      onNext={handleNextStep}
                      onBack={handlePreviousStep}
                    />
                    // TODO: one of these two forms will be shown (based on what vcs user has)
                    // <VcForm
                    //   vcData={vcData}
                    //   onSubmit={handleNextStep}
                    //   onBack={handlePreviousStep}
                    // />
                  )}
                  {step === 3 && (                    
                    <ReviewForm
                    // exchangeData={exchangeData}
                    // paymentData={{}}
                    // vcData={vcData}
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
