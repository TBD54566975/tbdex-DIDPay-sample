import React from 'react'

import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Offering, PaymentMethod } from '@tbd54566975/tbdex'

import { credentials } from './FormTypes'
import { ReviewForm } from './ReviewForm'
import { PaymentForm } from './SelectPaymentMethodsForm'
import { CreateVcForm } from './CreateVcForm'
import { useWeb5Context } from '../../context/Web5Context'
import { ProgressPanel, steps } from './ProgressPanel'
import { ExchangeForm, ExchangeFormData } from './ExchangeForm'

type RfqModalProps = {
  offering: Offering;
  pfiDid: string;
  isOpen: boolean;
  onClose: (hasSubmitted: boolean) => void;
};

export function RfqModal({ offering, pfiDid, isOpen, onClose }: RfqModalProps) {
  const { profile, web5 } = useWeb5Context()
  const [step, setStep] = useState(0)

  const [quoteCurrencyAmount, setQuoteCurrencyAmount] = useState('')
  const [exchangeData, setExchangeData] = useState<ExchangeFormData>({ amount: '' })

  const [selectedPayinMethod, setSelectedPayinMethod] = useState<PaymentMethod>(offering.payinMethods[0])
  const [selectedPayoutMethod, setSelectedPayoutMethod] = useState<PaymentMethod>(offering.payoutMethods[0])
  
  const [selectedPayinKind, setSelectedPayinKind] = useState<string>(offering.payinMethods[0].kind)
  const [payinDetails, setPayinDetails] = useState({})
  
  const [selectedPayoutKind, setSelectedPayoutKind] = useState<string>(offering.payoutMethods[0].kind)
  const [payoutDetails, setPayoutDetails] = useState({})

  const [vcs, setVcs] = useState([])

  const handleNextStep = async (formData?: any) => {
    if (step === 0) {
      const exchangeFormData = formData as ExchangeFormData
      setQuoteCurrencyAmount(exchangeFormData.amount)
    } else if (step === 1) {
      console.log('done with step 1. RFQ so far')
      console.log({
        amount: quoteCurrencyAmount,
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

  const handlePreviousStep = (formData: any) => {
    if (step === 1) {
      console.log('hi step 1 previous step handler')
      // const paymentFormData = formData as PaymentFormData;
      // setPaymentData(paymentFormData);
    } else if (step === 2) {
      const vcFormData = formData as SelectVcFormData
      setVcData(vcFormData)
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
                    <ExchangeForm
                      offering={offering}
                      exchangeData={exchangeData}
                      onSubmit={handleNextStep}
                    />
                  )}
                  {step === 1 && (
                    <PaymentForm
                      offering={offering}
                      selectedPayinMethod={selectedPayinMethod}
                      selectedPayoutMethod={selectedPayoutMethod}
                      setSelectedPayinMethod={setSelectedPayinMethod}
                      setSelectedPayoutMethod={setSelectedPayoutMethod}
                      selectedPayinKind={selectedPayinKind}
                      selectedPayoutKind={selectedPayoutKind}
                      payinDetails={payinDetails}
                      payoutDetails={payoutDetails}
                      setSelectedPayinKind={setSelectedPayinKind}
                      setSelectedPayoutKind={setSelectedPayoutKind}
                      setPayinDetails={setPayinDetails}
                      setPayoutDetails={setPayoutDetails}
                      onSubmit={handleNextStep}
                      onBack={handlePreviousStep}
                    />
                  )}
                  {step === 2 && (
                    <CreateVcForm
                      vcs={vcs}
                      kycRequirements={offering.kycRequirements}
                      onSubmit={handleNextStep}
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
                    <></>
                    
                  // <ReviewForm
                  //   exchangeData={exchangeData}
                  //   paymentData={{}}
                  //   vcData={vcData}
                  //   onSubmit={handleNextStep}
                  //   onBack={handlePreviousStep}
                  // />
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
