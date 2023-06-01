import React, { createContext } from 'react';
import { Web5 } from '@tbd54566975/web5';

interface Web5ContextType {
  web5: Web5 | null;
  did: string | null;
}

export const Web5Context = createContext<Web5ContextType>({
  web5: null,
  did: null,
});
