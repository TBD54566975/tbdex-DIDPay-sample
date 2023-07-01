import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Web5ContextProvider } from './context/Web5Context';
import { RootPage } from './features/app/root/RootPage';
import { IndexPage } from './features/app/IndexPage';
import { VerifiableCredentialsPage } from './features/credentials/VerifiableCredentialsPage';
import { HomePage } from './features/home/HomePage';
import { HistoryPage } from './features/history/HistoryPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OfferingsPage } from './features/offerings/OfferingsPage';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: '/verifiablecredentials',
        element: <VerifiableCredentialsPage />,
      },
      {
        path: '/history',
        element: <HistoryPage />,
      },
      {
        path: '/offerings',
        element: <OfferingsPage />,
      },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Web5ContextProvider>
        <RouterProvider router={router} />
      </Web5ContextProvider>
    </QueryClientProvider>
  );
}
