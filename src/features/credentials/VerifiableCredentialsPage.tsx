import { useCallback, useEffect, useState } from 'react';
import { useWeb5Context } from '../../context/Web5Context';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { CredentialCard } from './CredentialCard';
import DialogForm from '../../components/DialogForm/DialogForm';
import {
  CreateCredentialForm,
  AchVcForm,
  BtcVcForm,
  KycVcForm,
} from './CreateCredentialForms';

// Using require statement, as there are problems importing ssi-sdk-wasm types
const SSI = require('ssi-sdk-wasm');

export function VerifiableCredentialsPage() {
  const { web5, profile } = useWeb5Context();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [createCredentialForm, setCreateCredentialForm] = useState<
    CreateCredentialForm | undefined
  >(undefined);

  const fetchVcs = useCallback(async () => {
    const { records, status } = await web5.dwn.records.query({
      from: profile.did.id,
      message: {
        filter: {
          schema: 'my/vcs',
        },
      },
    });

    if (200 <= status.code && status.code <= 299) {
      const vcs = await Promise.all(
        records?.map(async (r) => {
          return await r.data.json();
        }) ?? []
      );

      setCredentials(vcs);
    }
  }, [web5, profile]);

  useEffect(() => {
    fetchVcs();
  }, [fetchVcs]);

  const handleCreateKycVcClick = () => {
    setCreateCredentialForm(KycVcForm);
  };

  const handleCreateAchVcClick = () => {
    setCreateCredentialForm(AchVcForm);
  };

  const handleCreateBtcVcClick = () => {
    setCreateCredentialForm(BtcVcForm);
  };

  const handleSubmit = async (formState: { [key: string]: string }) => {
    const result = await SSI.createVerifiableCredential(
      profile.did?.id,
      JSON.stringify(profile.did?.keys[0].privateKeyJwk),
      JSON.stringify({
        id: Math.random().toString(),
        type: createCredentialForm?.type,
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
      closeCreateCredentialDialog();
      setCredentials((prev) => {
        return [result, ...prev];
      });
    } else {
      console.error(`Error writing VC: ${status.code} - ${status.detail}`);
    }
  };

  const closeCreateCredentialDialog = () => {
    setCreateCredentialForm(undefined);
  };

  return (
    <>
      <Grid container spacing={3} columns={12}>
        {credentials.map((credential, index) => {
          return <CredentialCard key={index} creds={credential} />;
        })}
      </Grid>
      <Stack
        spacing={1}
        direction="column"
        sx={{ mt: 3, width: 'fit-content' }}
      >
        <Button variant="contained" onClick={handleCreateKycVcClick}>
          Create Self-Signed KYC VC
        </Button>
        <Button variant="contained" onClick={handleCreateAchVcClick}>
          Create Self-Signed ACH VC
        </Button>
        <Button variant="contained" onClick={handleCreateBtcVcClick}>
          Create Self-Signed BTC VC
        </Button>
      </Stack>
      <DialogForm
        onClose={closeCreateCredentialDialog}
        onSubmit={handleSubmit}
        form={createCredentialForm}
      />
    </>
  );
}
