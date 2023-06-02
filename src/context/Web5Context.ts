import { createContext } from 'react';
import { Web5 } from '@tbd54566975/web5';
import { Profile } from '@tbd54566975/web5-user-agent';

interface Web5ContextType {
  web5: Web5 | null;
  profile: Profile | null;
}

export const Web5Context = createContext<Web5ContextType>({
  web5: null,
  profile: null,
});
