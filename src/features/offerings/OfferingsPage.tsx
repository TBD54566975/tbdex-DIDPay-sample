import React, { useState } from 'react';
import { Box, Button, Stack, TextField } from '@mui/material';
import { useWeb5Context } from '../../context/Web5Context';
import { OfferingsList, type Offering } from './OfferingsList';

export function OfferingsPage() {
  const [pfiDid, setPfiDid] = useState('');
  const [offerings, setOfferings] = useState<Offering[]>([]);

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

  return (
    <Box>
      <h1>Offerings</h1>
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
      <OfferingsList offerings={offerings} />
    </Box>
  );
}
