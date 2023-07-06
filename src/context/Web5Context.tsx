import React, { createContext, useContext, useEffect, useState } from 'react';
import { Web5 } from '@tbd54566975/web5';
import { Profile, ProfileApi } from '@tbd54566975/web5-user-agent';
import { CircularProgress } from '@mui/material';
import {
  TbDEXMessage,
  OrderStatus,
  Status,
  aliceProtocolDefinition,
} from '@tbd54566975/tbdex';

interface Web5ContextType {
  web5: Web5;
  profile: Profile;
}

const Web5Context = createContext<Web5ContextType | undefined>(undefined);

type Props = { children: JSX.Element };
export const Web5ContextProvider = ({ children }: Props) => {
  const [contextValue, setContextValue] = useState<Web5ContextType | undefined>(
    undefined
  );

  useEffect(() => {
    const web5Connect = async () => {
      const { web5, did } = await Web5.connect();
      const profileApi = new ProfileApi();
      const profile = await profileApi.getProfile(did);
      if (!profile) return;

      await configureProtocol(web5);

      setContextValue({ web5, profile });
    };

    web5Connect();
  }, []);

  if (!contextValue) {
    // Display progress indicator until the context value is populated
    return <CircularProgress />;
  }

  return (
    <Web5Context.Provider value={contextValue}>{children}</Web5Context.Provider>
  );
};

export const useWeb5Context = () => {
  const context = useContext(Web5Context);

  if (!context) {
    throw new Error('useWeb5Context must be used within a Web5ContextProvider');
  }

  return context;
};

async function configureProtocol(web5: Web5) {
  const { protocols, status } = await web5.dwn.protocols.query({
    message: {
      filter: {
        protocol: aliceProtocolDefinition.protocol,
      },
    },
  });

  if (status.code !== 200) {
    alert('Failed to query protocols. check console');
    console.error('Failed to query protocols', status);
    return;
  }

  // protocol already exists
  if (protocols.length > 0) {
    console.log('protocol already exists', protocols[0]);
    return;
  }

  // create protocol
  const { status: configureStatus } = await web5.dwn.protocols.configure({
    message: {
      definition: aliceProtocolDefinition,
    },
  });

  console.log('configure protocol status', configureStatus);
}
