import { useCallback, useEffect, useState } from 'react';
import { useWeb5Context } from '../../context/Web5Context';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { CredentialCard } from './CredentialCard';

// Using require statement, as there are problems importing ssi-sdk-wasm types
const SSI = require('ssi-sdk-wasm');

export function VerifiableCredentialsPage() {
  const { web5, profile } = useWeb5Context();
  const [credentials, setCredentials] = useState<any[]>([]);

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

  async function selfSignNewVC() {
    const result = await SSI.createVerifiableCredential(
      profile.did?.id,
      JSON.stringify(profile.did?.keys[0].privateKeyJwk),
      JSON.stringify({
        id: Math.random().toString(),
        type: 'KYCAMLAttestation',
        process: 'selfAttest',
        approvalDate: new Date().toISOString(),
      })
    );

    const { status } = await web5.dwn.records.write({
      data: result,
      message: {
        schema: 'my/vcs',
      },
    });

    if (200 <= status.code && status.code <= 299) {
      setCredentials((prev) => {
        return [result, ...prev];
      });
    } else {
      console.error(`Error writing VC: ${status.code} - ${status.detail}`);
    }
  }

  return (
    <>
      <Grid container spacing={3} columns={12}>
        {credentials.map((credential, index) => {
          return <CredentialCard key={index} creds={credential} />;
        })}
      </Grid>
      <Button sx={{ mt: 3 }} variant="contained" onClick={selfSignNewVC}>
        Self Sign a New VC
      </Button>
    </>
  );
}
