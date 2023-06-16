import React, { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useWeb5Context } from '../../context/Web5Context';
import OfferingsList from './OfferingsList';
import DialogForm from '../../components/DialogForm/DialogForm';
import { RfqForm, createRfqForm } from './RfqForm';
import { Offering, RFQ } from '../../tbDexTypes';
import { tbDexProtocolDefinition } from '../../tbDexProtocol';

export function OfferingsPage() {
  const [pfiDid, setPfiDid] = useState('');
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [rfqForm, setRfqForm] = useState<RfqForm | undefined>(undefined);

  const { web5 } = useWeb5Context();

  const handlePfiDidChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPfiDid(event.target.value);
  };

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
    <Box>
      <Stack spacing={1}>
        <TextField
          label="PFI DID"
          value={pfiDid}
          onChange={handlePfiDidChange}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGetOfferingsClick}
        >
          Get Offerings
        </Button>
      </Stack>
      <OfferingsList
        offerings={offerings}
        onRfqButtonClick={handleRfqButtonClick}
      />
      <DialogForm
        onClose={closeRfqDialogForm}
        onSubmit={createRfq}
        form={rfqForm}
      />
    </Box>
  );
}
