import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  Offering,
  Rfq,
  aliceProtocolDefinition,
  createMessage,
} from '@tbd54566975/tbdex';
import { useWeb5Context } from '../../context/Web5Context';

type PaymentModalProps = {
  link: string;
  isOpen: boolean;
  onClose: (hasSubmitted: boolean) => void;
};

// TODO: send cents amount in rfq pls pls pls
export function PaymentModal({ link, isOpen, onClose }: PaymentModalProps) {
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
                  <iframe
                    title="payment-link"
                    className="w-full aspect-video ..."
                    src="https://sandbox.square.link/u/tucW7DFw
"
                  ></iframe>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
