import React, { useContext, useState } from 'react';
import { Web5Context } from '../context/Web5Context';
import { Box } from '@mui/material';

// Using require statement, as there are problems importing ssi-sdk-wasm types
const SSI = require('ssi-sdk-wasm');

export default function VerifiableCredentials() {
  const { profile } = useContext(Web5Context);
  const [vcs, setVcs] = useState<string[]>([]);

  async function selfSignNewVC() {
    const result = await SSI.createVerifiableCredential(
      profile?.did?.id,
      JSON.stringify(profile?.did?.keys[0].privateKeyJwk),
      JSON.stringify({ id: 'blah', foo: 'bar' })
    );

    setVcs((prev) => {
      return [JSON.stringify(result), ...prev];
    });
  }

  return (
    <Box overflow="auto">
      <h1>VCs</h1>
      <ul>
        {vcs.map((vc, index) => (
          <li key={index}>{vc}</li>
        ))}
      </ul>
      <button hidden={!profile} onClick={selfSignNewVC}>
        Self Sign a New VC
      </button>
    </Box>
  );
}
