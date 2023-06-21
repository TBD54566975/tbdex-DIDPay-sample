import React, { useState } from 'react';
import { useWeb5Context } from '../../context/Web5Context';
import { OfferingsListTailwind } from './OfferingsListTailwind';
import { RfqForm, createRfqForm } from './RfqForm';
import { Offering, RFQ } from '../../tbDexTypes';
import { tbDexProtocolDefinition } from '../../tbDexProtocol';
import { ExclamationCircleIcon } from '@heroicons/react/20/solid';

export function OfferingsPageTailwind() {
  const [pfiDid, setPfiDid] = useState('');
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [rfqForm, setRfqForm] = useState<RfqForm | undefined>(undefined);

  const { web5 } = useWeb5Context();

  const handleGetOfferingsClick = async () => {
    const { records } = await web5.dwn.records.query({
      from: pfiDid,
      message: {
        filter: {
          schema: 'https://tbdex.io/schemas/offering',
        },
      },
    });

    const offerings = await Promise.all(
      records?.map(async (r) => {
        return (await r.data.json()) as Offering;
      }) ?? []
    );

    setOfferings(offerings);
  };

  const handleRfqButtonClick = (offering: Offering) => {
    setRfqForm(createRfqForm(offering));
  };

  const createRfq = async (formData: { [key: string]: string }) => {
    const rfq: RFQ = {
      offering_id: rfqForm!.offering_id, // TODO: move this, maybe to `Form` and have caller supply constructor?
      product: rfqForm!.product,
      size: parseInt(formData['size']),
      presentation_submission: {},
    };

    const { record, status } = await web5.dwn.records.write({
      data: rfq,
      message: {
        protocol: tbDexProtocolDefinition.protocol,
        protocolPath: 'RFQ',
        schema: 'https://tbd.website/protocols/tbdex/RequestForQuote',
        recipient: pfiDid,
      },
    });

    if (200 <= status.code && status.code <= 299) {
      closeRfqDialogForm();
    } else {
      alert('Error creating RFQ (Code $(status.code)');
    }
  };

  const closeRfqDialogForm = () => {
    setRfqForm(undefined);
  };

  return (
    <div className="flex flex-col items-end">
      <div className="w-full">
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          PFI DID
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
          <input
            type="email"
            name="email"
            id="email"
            className="block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
            placeholder="did:ion:..."
            defaultValue="Karma, karma, karma, karma, karma chameleon"
            aria-invalid="true"
            aria-describedby="pfi-error"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ExclamationCircleIcon
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        </div>
        <p className="mt-2 text-sm text-red-600" id="pfi-error">
          Not a valid PFI DID.
        </p>
      </div>
      <button
        type="button"
        className="mt-2 rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20"
        onClick={handleGetOfferingsClick}
      >
        Get Offerings
      </button>

      <hr className="my-4"></hr>
      <div className="w-full">
        <OfferingsListTailwind
          replaceWithOfferings={offerings}
          onRfqButtonClick={handleRfqButtonClick}
        ></OfferingsListTailwind>
      </div>
    </div>
  );
}
