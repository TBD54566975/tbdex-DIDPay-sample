import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Web5ContextProvider } from './context/Web5Context';
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
