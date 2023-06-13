import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogProps,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Form } from './DialogFormTypes';
import { useWeb5Context } from '../../context/Web5Context';
import { ChangeEvent } from 'react';

// Using require statement, as there are problems importing ssi-sdk-wasm types
const SSI = require('ssi-sdk-wasm');

type Props = {
  onClose: DialogProps['onClose'];
  onCreate: (credential: any) => void;
  form?: Form;
};
export default function DialogForm({ onClose, onCreate, form }: Props) {
  const { web5, profile } = useWeb5Context();
  const [formState, setFormState] = useState<{ [key: string]: string }>({});

  if (!form) {
    return null;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormState((prev) => {
      return {
        ...prev,
        [event.target.name]: event.target.value,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = await SSI.createVerifiableCredential(
      profile.did?.id,
      JSON.stringify(profile.did?.keys[0].privateKeyJwk),
      JSON.stringify({
        id: Math.random().toString(),
        type: form.type,
        ...formState,
      })
    );

    const { status } = await web5.dwn.records.write({
      data: result,
      message: {
        schema: 'my/vcs',
      },
    });

    if (200 <= status.code && status.code <= 299) {
      onCreate(result);
    } else {
      console.error(`Error writing VC: ${status.code} - ${status.detail}`);
    }
  };

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogContent>
        <Typography variant="h5">{form.title}</Typography>
        <Typography variant="body1" color={'text.secondary'}>
          {form.subtitle}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2} direction="column" sx={{ mt: 3, mb: 3 }}>
            {form.fields.map((field) => (
              <TextField
                key={field.name}
                name={field.name}
                label={field.label}
                value={formState[field.name] || ''}
                onChange={handleChange}
              />
            ))}
          </Stack>
          <Button type="submit" variant="contained">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
