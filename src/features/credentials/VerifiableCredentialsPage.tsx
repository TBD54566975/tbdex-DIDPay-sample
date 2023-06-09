import { useCallback, useEffect, useState } from 'react';
import { useWeb5Context } from '../../context/Web5Context';
import { Button, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { CredentialCard } from './CredentialCard';
import CreateCredentialDialog from './CreateCredentialDialog';
import { CreateCredentialForm } from './CreateCredentialTypes';
import { AchVcForm, BtcVcForm, KycVcForm } from './CreateCredentialForms';

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

  const handleCreateCredential = (credential: any) => {
    setCredentials((prev) => {
      return [credential, ...prev];
    });
    closeCreateCredentialDialog();
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
      <CreateCredentialDialog
        onClose={closeCreateCredentialDialog}
        onCreate={handleCreateCredential}
        form={createCredentialForm}
      />
    </>
  );
}
