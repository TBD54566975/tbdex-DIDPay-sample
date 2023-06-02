import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import Profile, { loader as profileLoader } from './routes/Profile';
import VerifiableCredentials from './routes/VerifiableCredentials';
import Index from './routes/Index';
import { Web5 } from '@tbd54566975/web5';
import {
  Profile as Web5Profile,
  ProfileApi,
} from '@tbd54566975/web5-user-agent';
import { Web5Context } from './context/Web5Context';
import { CircularProgress } from '@mui/material';
import Offerings from './routes/Offerings';
import Quotes from './routes/Quotes';
import Orders from './routes/Orders';

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
        path: '/profile/:profileId',
        element: <Profile />,
        loader: profileLoader,
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
