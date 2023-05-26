import React, { useEffect, useState } from "react";
import { Web5 } from "@tbd54566975/web5";
import { DidState } from "@tbd54566975/dids";
import { ProfileApi } from "@tbd54566975/web5-user-agent";
import "./App.css";

// Using require statement, as there are problems importing ssi-sdk-wasm types
const SSI = require("ssi-sdk-wasm");

export default function App() {
  const [didState, setDidState] = useState<DidState | undefined>(undefined);
  const [vcs, setVcs] = useState<string[]>([]);

  useEffect(() => {
    web5Connect();
  }, []);

  async function web5Connect() {
    const { did } = await Web5.connect();

    const profileApi = new ProfileApi();
    const profile = await profileApi.getProfile(did);
    setDidState(profile?.did);
  }

  async function selfSignNewVC() {
    const result = await SSI.createVerifiableCredential(
      didState?.id,
      JSON.stringify(didState?.keys[0].privateKeyJwk),
      JSON.stringify({ id: "blah", foo: "bar" })
    );

    setVcs((prev) => {
      return [JSON.stringify(result), ...prev];
    });
  }

  return (
    <div className="App">
      <p>didState: {didState ? JSON.stringify(didState) : "not created"}</p>
      <h1>VCs</h1>
      <ul>
        {vcs.map((vc, index) => (
          <li key={index}>{vc}</li>
        ))}
      </ul>
      <button hidden={!didState} onClick={selfSignNewVC}>
        Self Sign a New VC
      </button>
    </div>
  );
}
