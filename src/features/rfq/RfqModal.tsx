import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ProgressPanel, Step, steps } from './ProgressPanel';
import { ReviewForm } from './ReviewForm';
import { CreateVcForm } from './CreateVcForm';
import { SelectVcForm, SelectVcFormData } from './SelectVcForm';
import { ExchangeForm, ExchangeFormData } from './ExchangeForm';
import { PaymentForm, SelectedPaymentMethodData } from './PaymentForm';
import { Offering } from '@tbd54566975/tbdex';
import { Encoder } from '@tbd54566975/dwn-sdk-js';
import { getVcs, createRfq } from '../../utils/Web5Utils';
import { useWeb5Context } from '../../context/Web5Context';
import { credentials } from './FormTypes';
import { PEXv2 } from '@sphereon/pex';
import { RJSFSchema } from '@rjsf/utils';

type RfqModalProps = {
  offering: Offering;
  pfiDid: string;
  isOpen: boolean;
  onClose: (hasSubmitted: boolean) => void;
};

export function RfqModal({ offering, pfiDid, isOpen, onClose }: RfqModalProps) {
  const { profile, web5 } = useWeb5Context();
  const [step, setStep] = useState(0);

  const [exchangeData, setExchangeData] = useState<ExchangeFormData>({
    amount: '',
  });
  const [selectedPayinData, setSelectedPayinData] =
    useState<SelectedPaymentMethodData>({
      kind: 'undefined',
      details: undefined,
    });
  const [selectedPayoutData, setSelectedPayoutData] =
    useState<SelectedPaymentMethodData>({
      kind: 'undefined',
      details: undefined,
    });
  const [vcData, setVcData] = useState<SelectVcFormData>({
    credential: credentials[0].issuer.name,
  });

  const [vcs, setVcs] = useState<string[]>([]);

  const kycProof =
    'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDprZXk6ejZNa29KYzQ2elNkRnh0WmJHN0JCVjFDMWlmQ2ljR1VoVEJTWTc5RGpmYmg1WFcyI3o2TWtvSmM0NnpTZEZ4dFpiRzdCQlYxQzFpZkNpY0dVaFRCU1k3OURqZmJoNVhXMiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODgzMzEyOTcsImlzcyI6ImRpZDprZXk6ejZNa29KYzQ2elNkRnh0WmJHN0JCVjFDMWlmQ2ljR1VoVEJTWTc5RGpmYmg1WFcyIiwidnAiOnsiQGNvbnRleHQiOlsiaHR0cHM6Ly93d3cudzMub3JnLzIwMTgvY3JlZGVudGlhbHMvdjEiXSwiaG9sZGVyIjoiZGlkOmtleTp6Nk1rb0pjNDZ6U2RGeHRaYkc3QkJWMUMxaWZDaWNHVWhUQlNZNzlEamZiaDVYVzIiLCJwcmVzZW50YXRpb25fc3VibWlzc2lvbiI6eyJkZWZpbml0aW9uX2lkIjoiMmVkZGYyNWYtZjc5Zi00MTA1LWFjODEtNTQ0Yzk4OGY2ZDc4IiwiZGVzY3JpcHRvcl9tYXAiOlt7ImZvcm1hdCI6Imp3dF92cCIsImlkIjoiMCIsInBhdGgiOiIkLnZlcmlmaWFibGVDcmVkZW50aWFsWzBdIn1dLCJpZCI6ImJvYi1zdWJtaXNzaW9uLWlkIn0sInR5cGUiOlsiVmVyaWZpYWJsZVByZXNlbnRhdGlvbiJdLCJ2ZXJpZmlhYmxlQ3JlZGVudGlhbCI6WyJleUpoYkdjaU9pSkZaRVJUUVNJc0ltdHBaQ0k2SWpobVlUaGtaVGN6TFRNMVpUQXROREJqTWkxaE9UVmtMVGt4T0RnMU9XTmxOVGczWkNJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFlYUWlPakUyT0Rnek16RXlPVGNzSW1semN5STZJbVJwWkRwclpYazZlalpOYTI5S1l6UTJlbE5rUm5oMFdtSkhOMEpDVmpGRE1XbG1RMmxqUjFWb1ZFSlRXVGM1UkdwbVltZzFXRmN5SWl3aWFuUnBJam9pTVdNMU5qUTJNV1l0TWpNMk55MDBZV1V5TFdFME56TXRNREU0WmpRNE9HUmhOR1ZpSWl3aWJtSm1Jam94TmpnNE16TXhNamszTENKdWIyNWpaU0k2SWpnNU5EYzFPV0pqTFROaU1HRXROR1ZsT0MwNE1tUTNMVE0yTWpZME5tUXhNVGMxWVNJc0luTjFZaUk2SW1ScFpEcHJaWGs2ZWpaTmEyOUtZelEyZWxOa1JuaDBXbUpITjBKQ1ZqRkRNV2xtUTJsalIxVm9WRUpUV1RjNVJHcG1ZbWcxV0ZjeUlpd2lkbU1pT25zaVFHTnZiblJsZUhRaU9sc2lhSFIwY0hNNkx5OTNkM2N1ZHpNdWIzSm5Mekl3TVRndlkzSmxaR1Z1ZEdsaGJITXZkakVpWFN3aWRIbHdaU0k2V3lKV1pYSnBabWxoWW14bFEzSmxaR1Z1ZEdsaGJDSmRMQ0pwYzNOMVpYSWlPaUlpTENKcGMzTjFZVzVqWlVSaGRHVWlPaUlpTENKamNtVmtaVzUwYVdGc1UzVmlhbVZqZENJNmV5SmhaR1J5WlhOeklqcDdJbU52ZFc1MGNua2lPaUpWVTBFaUxDSnNiMk5oYkdsMGVTSTZJa3h2Y3lCQmJtZGxiR1Z6SWl3aWNHOXpkR0ZzUTI5a1pTSTZJamt3TWpFd0lpd2ljbVZuYVc5dUlqb2lRMEVpTENKemRISmxaWFJCWkdSeVpYTnpJam9pTVRJeklFaHZiR3g1ZDI5dlpDQkNiSFprTGlKOUxDSmlhWEowYUVSaGRHVWlPaUl3TlMwd01pMHhPVGN5SWl3aVptRnRhV3g1VG1GdFpTSTZJbXB2YUc1emIyNGlMQ0ptYVhKemRFNWhiV1VpT2lKaWIySWlMQ0puYVhabGJrNWhiV1VpT2lKa2QyRjVibVVpTENKdGFXUmtiR1ZPWVcxbElqb2lkR2hsSUhKdlkyc2lMQ0p3WlhKemIyNWhiRWxrWlc1MGFXWnBaWElpT2x0N0ltbGtaVzUwYVdacFpYSWlPaUl4TWpNdE5EVXROamM0T1NJc0ltbHpjM1ZsY2lJNklsVlRJRk52WTJsaGJDQlRaV04xY21sMGVTQkJaRzFwYm1semRISmhkR2x2YmlJc0luUjVjR1VpT2lKVGIyTnBZV3dnVTJWamRYSnBkSGtnVG5WdFltVnlJbjFkZlgxOS53LWlqTWdnNkZuMklBSDRkVXJ2djRCQ2M0Q3drNlJtMFdKSmtiMEJlOFY1MUkweVcxMFRjQzU3czI2emVaY0lrRTVlbjExbEtLYWRlTVktRTFQQ2ZDUSJdfSwiZXhwIjoxNjg4MzM4NDk3fQ.allPa5CrO7-sCv4XC6as7ri75chITd9fdTl4vZ07ogPpn0vLZa6vA_v2BbsT1RWhDiVluYtVINKFxj_RvydtBQ';

  const schema: RJSFSchema = {
    schema: 'http://json-schema.org/draft-07/schema',
    required: ['BTC Address'],
    properties: {
      name: {
        type: 'string',
      },
      date: {
        type: 'number',
      },
      'phone number': {
        type: 'string',
      },
      address: {
        type: 'number',
      },
    },
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setVcs(await getVcs(web5));
  //   };
  //   fetchData();
  // }, []);

  // const pex = new PEXv2();
  // const { kycRequirements: pdJwt } = offering;
  // const [_header, payload, _signature] = pdJwt.split('.');
  // const pdFromOffering = Encoder.base64UrlToObject(payload);

  // const result = pex.selectFrom(pdFromOffering as any, vcs);
  // console.log(result);

  // if (result.areRequiredCredentialsPresent) {
  //   const { presentation } = pex.presentationFrom(pdFromOffering, vcs);
  // } else {
  // }

  const handleNextStep = (formData: any) => {
    if (step === 0) {
      const exchangeFormData = formData as ExchangeFormData;
      setExchangeData(exchangeFormData);
    } else if (step === 1) {
      console.log('hi')
      // const paymentFormData = formData as PaymentFormData;
      // setPaymentData(paymentFormData);
    } else if (step === 2) {
      const vcFormData = formData as SelectVcFormData;
      setVcData(vcFormData);
    } else if (step === 3) {
      createRfq(
        web5,
        profile.id,
        pfiDid,
        offering.id,
        exchangeData.amount,
        kycProof,
        undefined as any,
        undefined as any,
      );
      onClose(true);
    }

    setStep((prevStep) => prevStep + 1);
  };

  const handlePreviousStep = (formData: any) => {
    if (step === 1) {
      console.log('hi step 1 previous step handler')
      // const paymentFormData = formData as PaymentFormData;
      // setPaymentData(paymentFormData);
    } else if (step === 2) {
      const vcFormData = formData as SelectVcFormData;
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
                      setSelectedPayinData={setSelectedPayinData}
                      setSelectedPayoutData={setSelectedPayoutData}
                      onSubmit={handleNextStep}
                      onBack={handlePreviousStep}
                    />
                  )}
                  {step === 2 && (
                    <CreateVcForm
                      schema={schema}
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
                    <ReviewForm
                      exchangeData={exchangeData}
                      paymentData={{}}
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
