import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Web5 } from '@tbd54566975/web5';
import {
  Profile as Web5Profile,
  ProfileApi,
} from '@tbd54566975/web5-user-agent';
import { Web5ContextProvider, useWeb5Context } from './context/Web5Context';
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
  return (
    <Web5ContextProvider>
      <RouterProvider router={router} />
    </Web5ContextProvider>
  );
}
