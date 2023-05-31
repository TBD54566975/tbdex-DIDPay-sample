import React, { useEffect, useState } from 'react';
import { Web5 } from '@tbd54566975/web5';
import { Profile, ProfileApi } from '@tbd54566975/web5-user-agent';
import './Root.css';
import ProfileCard from '../components/ProfileCard';
import { CircularProgress } from '@mui/material';

// Using require statement, as there are problems importing ssi-sdk-wasm types
const SSI = require('ssi-sdk-wasm');

export default function App() {
  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [vcs, setVcs] = useState<string[]>([]);

  useEffect(() => {
    web5Connect();
  }, []);

  async function web5Connect() {
    const { did } = await Web5.connect();

    const profileApi = new ProfileApi();
    const profile = await profileApi.getProfile(did);
    setProfile(profile);
  }

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

  if (!!profile) {
    return (
      <div className="container">
        <ProfileCard profile={profile} />
        <h1>VCs</h1>
        <ul>
          {vcs.map((vc, index) => (
            <li key={index}>{vc}</li>
          ))}
        </ul>
        <button hidden={!profile} onClick={selfSignNewVC}>
          Self Sign a New VC
        </button>
      </div>
    );
  } else {
    return (
      <div className="container">
        <CircularProgress />
      </div>
    );
  }
}
