import React, { createContext, useContext, useEffect, useState } from 'react';
import { Web5 } from '@tbd54566975/web5';
import { Profile, ProfileApi } from '@tbd54566975/web5-user-agent';
import { CircularProgress } from '@mui/material';

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

export const useWeb5Context = (): Web5ContextType => {
  const context = useContext(Web5Context);

  if (!context) {
    throw new Error('useWeb5Context must be used within a Web5ContextProvider');
  }

  return context;
};
