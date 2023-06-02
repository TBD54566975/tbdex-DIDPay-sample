import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Web5 } from '@tbd54566975/web5';
import {
  Profile as Web5Profile,
  ProfileApi,
} from '@tbd54566975/web5-user-agent';
import { Web5Context } from './context/Web5Context';
import { CircularProgress } from '@mui/material';
import Root from './routes/Root';
import Index from './routes/Index';
import VerifiableCredentials from './routes/VerifiableCredentials';
import Offerings from './routes/Offerings';
import Quotes from './routes/Quotes';
import Orders from './routes/Orders';
import Profile from './routes/Profile';

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
        path: '/offerings',
        element: <Offerings />,
      },
      {
        path: '/quotes',
        element: <Quotes />,
      },
      {
        path: '/orders',
        element: <Orders />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
    ],
  },
]);

export default function App() {
  const [web5, setWeb5] = useState<Web5 | undefined>(undefined);
  const [profile, setProfile] = useState<Web5Profile | undefined>(undefined);

  useEffect(() => {
    web5Connect();
  }, []);

  async function web5Connect() {
    const { web5, did } = await Web5.connect();
    const profileApi = new ProfileApi();
    const profile = await profileApi.getProfile(did);

    setWeb5(web5);
    setProfile(profile);
  }

  if (web5 && profile) {
    return (
      <Web5Context.Provider value={{ web5, profile }}>
        <RouterProvider router={router} />
      </Web5Context.Provider>
    );
  } else {
    return <CircularProgress />;
  }
}
