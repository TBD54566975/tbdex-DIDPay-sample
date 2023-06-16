import React from 'react';
import { Box, Button, List, ListItem, Typography } from '@mui/material';
import { Offering } from '../../tbDexTypes';

type Props = {
  offerings: Offering[];
  onRfqButtonClick: (offering: Offering) => void;
};
export default function OfferingsList({ offerings, onRfqButtonClick }: Props) {
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
              <Button
                variant="outlined"
                onClick={() => onRfqButtonClick(offering)}
              >
                Send RFQ
              </Button>
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
