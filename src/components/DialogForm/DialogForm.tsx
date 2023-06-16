import React, { ChangeEvent, useState } from 'react';
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

type Props = {
  onClose: DialogProps['onClose'];
  onSubmit: (formState: { [key: string]: string }) => void;
  form?: Form;
};
export default function DialogForm({ onClose, onSubmit, form }: Props) {
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
    onSubmit(formState);
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
