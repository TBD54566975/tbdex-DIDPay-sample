import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import Profile, { loader as profileLoader } from './routes/Profile';
import VerifiableCredentials from './routes/VerifiableCredentials';
import Index from './routes/Index';
import TBDex from './routes/TBDex';
import { Web5Context } from './context/Web5Context';
import { Web5 } from '@tbd54566975/web5';
import { CircularProgress } from '@mui/material';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Index />,
      },
      {
        path: '/verifiablecredentials',
        element: <VerifiableCredentials />,
      },
      {
        path: '/tbdex',
        element: <TBDex />,
      },
    ],
  },
  {
    path: '/profile/:profileId',
    element: <Profile />,
    loader: profileLoader,
  },
]);

export default function App() {
  const [web5, setWeb5] = useState<Web5 | null>(null);
  const [did, setDid] = useState<string | null>(null);

  useEffect(() => {
    web5Connect();
  }, []);

  async function web5Connect() {
    const { web5, did } = await Web5.connect();
    setWeb5(web5);
    setDid(did);
  }

  if (web5 && did) {
    return (
      <Web5Context.Provider value={{ web5, did }}>
        <RouterProvider router={router} />
      </Web5Context.Provider>
    );
  } else {
    return <CircularProgress />;
  }
}
