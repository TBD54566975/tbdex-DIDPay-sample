import React from 'react';
import { Box, List, ListItem, Typography } from '@mui/material';

// TODO: Offering/PaymentInstrument should be pulled out into
// a common library once it's solidified ab it more.
// That way these objects can be used across this app and PFI app.
export type Offering = {
  id: string;
  pair: string;
  unitPrice: string;
  fee: string;
  min?: string;
  max?: string;
  payinInstruments: PaymentInstrument[];
  payoutInstruments: PaymentInstrument[];
  presentationRequest: object;
};

export type PaymentInstrument = {
  kind: string;
  fee?: string;
  presentationRequest?: object;
};

type Props = { offerings: Offering[] };
export function OfferingsList({ offerings }: Props) {
  return (
    <Box>
      <List>
        {offerings.map((offering) => (
          <ListItem key={offering.id} divider>
            <Box>
              <Typography variant="h6">{offering.id}</Typography>
              <Typography variant="body1">
                Pair: {offering.pair}, Unit Price: {offering.unitPrice}, Fee:{' '}
                {offering.fee}, Min: {offering.min || 'N/A'}, Max:{' '}
                {offering.max || 'N/A'}
              </Typography>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
