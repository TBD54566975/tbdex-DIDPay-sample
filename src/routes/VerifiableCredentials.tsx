import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Web5Context } from '../context/Web5Context';
import { Box } from '@mui/material';

// Using require statement, as there are problems importing ssi-sdk-wasm types
const SSI = require('ssi-sdk-wasm');

export default function VerifiableCredentials() {
  const { web5, profile } = useContext(Web5Context);
  const [vcs, setVcs] = useState<any[]>([]);

  const fetchVcs = useCallback(async () => {
    if (!web5 || !profile) {
      return;
    }
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

      setVcs(vcs);
    }
  }, [web5, profile]);

  useEffect(() => {
    fetchVcs();
  }, [fetchVcs]);

  async function selfSignNewVC() {
    // TODO: this sucks, find a way to make web5 non-optional
    if (!web5) {
      return;
    }

    const result = await SSI.createVerifiableCredential(
      profile?.did?.id,
      JSON.stringify(profile?.did?.keys[0].privateKeyJwk),
      JSON.stringify({ id: 'blah', foo: 'bar' })
    );

    const { status } = await web5.dwn.records.write({
      data: result,
      message: {
        schema: 'my/vcs',
      },
    });

    if (200 <= status.code && status.code <= 299) {
      setVcs((prev) => {
        return [result, ...prev];
      });
    } else {
      console.error(`Error writing VC: ${status.code} - ${status.detail}`);
    }
  }

  return (
    <Box overflow="auto">
      <h1>VCs</h1>
      <ul>
        {vcs.map((vc, index) => (
          <li key={index}>{JSON.stringify(vc)}</li>
        ))}
      </ul>
      <button hidden={!profile} onClick={selfSignNewVC}>
        Self Sign a New VC
      </button>
    </Box>
  );
}
