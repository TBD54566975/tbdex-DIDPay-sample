import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ProgressPanel } from './ProgressPanel';
import { ReviewForm } from './ReviewForm';
import { VcForm } from './VcForm';
import { ExchangeForm } from './ExchangeForm';
import { PaymentForm } from './PaymentForm';
import { Offering, Rfq, aliceProtocolDefinition } from '@tbd54566975/tbdex';
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

  // TODO: follow up on PaymentMethodKind returning numbers
  const createRfq = async () => {
    // Create the Rfq object from form data
    const rfq: Rfq = {
      baseCurrency: offering.baseCurrency,
      quoteCurrency: offering.quoteCurrency,
      amount: exchangeData.amount,
      kycProof: 'proofff',
      payinMethod: {
        kind: paymentData.payinInstrument,
      },
      payoutMethod: {
        kind: paymentData.payoutInstrument,
      },
    };

    const { record, status } = await web5.dwn.records.write({
      data: rfq,
      message: {
        protocol: aliceProtocolDefinition.protocol,
        protocolPath: 'RFQ',
        schema: aliceProtocolDefinition.types.RFQ.schema,
        recipient:
          'did:ion:EiB1rtmnzpHDkTgVPkx9wUbS_OrtF5yIJEpICsZlsHq86g:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJhdXRoeiIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJ2UGlPYTVtMXhzQXI3NUVVN2pDVE9PeU9tYk5ocjEwNHVoUkR5YnBfcmM0IiwieSI6InlqMzdUT0RiQjUwbkVtZnFfb3JNVEpDM2lHNXh5Wk9LaXBhbGFzWW85NW8ifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6Ikpzb25XZWJLZXkyMDIwIn0seyJpZCI6ImVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiI1NGxqSXhiSFlBYjdtVnF0S2x3YmdBTEJCOUQwLUJiN1loVG9rNnJSZkdFIiwieSI6IjRqam80RDFzbHY5b3BGeTlDVWVtbGV2TklDYXRjV2huR1d6Q1NIa0VlbXMifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7Im1lc3NhZ2VBdXRob3JpemF0aW9uS2V5cyI6WyIjYXV0aHoiXSwibm9kZXMiOlsiaHR0cHM6Ly9kd24udGJkZGV2Lm9yZy9kd241IiwiaHR0cHM6Ly9kd24udGJkZGV2Lm9yZy9kd24zIl0sInJlY29yZEVuY3J5cHRpb25LZXlzIjpbIiNlbmMiXX0sInR5cGUiOiJEZWNlbnRyYWxpemVkV2ViTm9kZSJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQzdMVjc1QkFRVkpaaDh3ZFpOZkk2LUlNTzJ3Vm5UTWk4SVlPUUt4aHpmbncifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUFuRE9PalVzVkFUbE5uS3RxbUl4dzVKUDZocFUtSWpqWHItdWJMN1RFWTRRIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlCZEk0VEFEUUdZSVRnMHlQR2ZMS1U1X2lYQndicWlfQ2FkaElkRThxWkNuQSJ9fQ',
        // recipient: pfiDid,
      },
    });

    if (200 <= status.code && status.code <= 299) {
      console.log(status.code + ' ' + status.detail);
    } else {
      console.log(status.code + ' ' + status.detail);
      alert('Error creating RFQ (Code $(status.code)');
    }

    record?.send(
      'did:ion:EiB1rtmnzpHDkTgVPkx9wUbS_OrtF5yIJEpICsZlsHq86g:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJhdXRoeiIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJ2UGlPYTVtMXhzQXI3NUVVN2pDVE9PeU9tYk5ocjEwNHVoUkR5YnBfcmM0IiwieSI6InlqMzdUT0RiQjUwbkVtZnFfb3JNVEpDM2lHNXh5Wk9LaXBhbGFzWW85NW8ifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6Ikpzb25XZWJLZXkyMDIwIn0seyJpZCI6ImVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiI1NGxqSXhiSFlBYjdtVnF0S2x3YmdBTEJCOUQwLUJiN1loVG9rNnJSZkdFIiwieSI6IjRqam80RDFzbHY5b3BGeTlDVWVtbGV2TklDYXRjV2huR1d6Q1NIa0VlbXMifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7Im1lc3NhZ2VBdXRob3JpemF0aW9uS2V5cyI6WyIjYXV0aHoiXSwibm9kZXMiOlsiaHR0cHM6Ly9kd24udGJkZGV2Lm9yZy9kd241IiwiaHR0cHM6Ly9kd24udGJkZGV2Lm9yZy9kd24zIl0sInJlY29yZEVuY3J5cHRpb25LZXlzIjpbIiNlbmMiXX0sInR5cGUiOiJEZWNlbnRyYWxpemVkV2ViTm9kZSJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQzdMVjc1QkFRVkpaaDh3ZFpOZkk2LUlNTzJ3Vm5UTWk4SVlPUUt4aHpmbncifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUFuRE9PalVzVkFUbE5uS3RxbUl4dzVKUDZocFUtSWpqWHItdWJMN1RFWTRRIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlCZEk0VEFEUUdZSVRnMHlQR2ZMS1U1X2lYQndicWlfQ2FkaElkRThxWkNuQSJ9fQ'
    );
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
