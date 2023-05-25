import React, { useState } from "react";
import { Web5 } from "@tbd54566975/web5";
import { DidState } from "@tbd54566975/dids";
import "./App.css";

// Using require statement, as there are problems importing ssi-sdk-wasm types
const SSI = require("ssi-sdk-wasm");

function App() {
  const [didIon, setDidIon] = useState<DidState | undefined>(undefined);
  const [didKey, setDidKey] = useState<any | undefined>(undefined);

  async function createDidIon() {
    setDidIon(await Web5.did.create("ion"));
  }

  async function createDidKey() {
    setDidKey(await SSI.createDIDKey());
  }

  async function web5Connect() {
    const { web5, did } = await Web5.connect();
    console.log("web5: " + JSON.stringify(web5));
    console.log("connectedDid: " + did);
  }

  return (
    <div className="App">
      <button onClick={createDidIon}>Create a did:ion with web5-js</button>
      <p>{didIon ? didIon.id : ""}</p>
      <button onClick={createDidKey}>Create a did:key with ssi-sdk-wasm</button>
      <p>{didKey ? didKey.didDocument.id : ""}</p>
      <button onClick={web5Connect}>Web5 Connect</button>
    </div>
  );
}

export default App;
