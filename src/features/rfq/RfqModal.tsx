import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ProgressPanel } from './ProgressPanel';
import { ReviewForm } from './ReviewForm';
import { VcForm } from './VcForm';
import { ExchangeForm } from './ExchangeForm';
import { PaymentForm } from './PaymentForm';
import { Offering } from '@tbd54566975/tbdex';
import { useWeb5Context } from '../../context/Web5Context';

import {
  FormData,
  ExchangeFormData,
  PaymentFormData,
  VcFormData,
  Step,
  credentials,
} from './FormTypes';

type RfqModalProps = {
  offering: Offering;
  isOpen: boolean;
  onClose: (hasSubmitted: boolean) => void;
};

export function RfqModal({ offering, isOpen, onClose }: RfqModalProps) {
  const { profile, web5 } = useWeb5Context();

  const [step, setStep] = useState(0);
  const [exchangeData, setExchangeData] = useState<ExchangeFormData>({
    amount: '',
  });
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    payinInstrument: offering.payinMethods[0].kind,
    payoutInstrument: offering.payoutMethods[0].kind,
  });
  const [vcData, setVcData] = useState<VcFormData>({
    credential: credentials[0].issuer.name,
  });

  const steps: Step[] = [
    { name: 'Exchange', status: 'complete' },
    { name: 'Payments', status: 'current' },
    { name: 'Select VCs', status: 'upcoming' },
    { name: 'Review', status: 'upcoming' },
  ];

  const createRfq = async () => {
    // const rfq: Rfq = {
    //   pair: offering.pair, // TODO: move this, maybe to `Form` and have caller supply constructor?
    //   amount: exchangeData.amount,
    //   verifiablePresentationJwt: vcData.credential,
    //   payinInstrument: {
    //     kind: paymentData.payinInstrument
    //   },
    //   payoutInstrument: {
    //     kind: paymentData.payoutInstrument
    //   }
    // };
    // const { record, status } = await web5.dwn.records.write({
    //   data: rfq,
    //   message: {
    //     protocol: tbDexProtocolDefinition.protocol,
    //     protocolPath: 'RFQ',
    //     schema: 'https://tbd.website/protocols/tbdex/RequestForQuote',
    //     recipient: pfiDid,
    //   },
    // });
    // if (200 <= status.code && status.code <= 299) {
    //   // closeRfqDialogForm();
    // } else {
    //   alert('Error creating RFQ (Code $(status.code)');
    // }
  };

  const handleNextStep = (formData: FormData | null = null) => {
    if (step === 0) {
      const exchangeFormData = formData as ExchangeFormData;
      setExchangeData(exchangeFormData);
    } else if (step === 1) {
      const paymentFormData = formData as PaymentFormData;
      setPaymentData(paymentFormData);
    } else if (step === 2) {
      const vcFormData = formData as VcFormData;
      setVcData(vcFormData);
    } else if (step === 3) {
      createRfq();
      onClose(true);
    }

    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = (formData?: FormData) => {
    if (step === 1) {
      const paymentFormData = formData as PaymentFormData;
      setPaymentData(paymentFormData);
    } else if (step === 2) {
      const vcFormData = formData as VcFormData;
      setVcData(vcFormData);
    }
    setStep((prevStep) => prevStep - 1);
  };

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
                  className={`relative transform overflow-hidden rounded-lg bg-black pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:mt-24 mt-24 w-full lg:ml-72`}
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
                      paymentData={paymentData}
                      onSubmit={handleNextStep}
                      onBack={handlePreviousStep}
                    />
                  )}
                  {step === 2 && (
                    <VcForm
                      vcData={vcData}
                      onSubmit={handleNextStep}
                      onBack={handlePreviousStep}
                    />
                  )}
                  {step === 3 && (
                    <ReviewForm
                      exchangeData={exchangeData}
                      paymentData={paymentData}
                      vcData={vcData}
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
  );
}
