import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './routes/Root';
import Profile, { loader as profileLoader } from './routes/Profile';
import VerifiableCredentials from './routes/VerifiableCredentials';
import Index from './routes/Index';
import TBDex from './routes/TBDex';

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
  return <RouterProvider router={router} />;
}
