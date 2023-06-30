import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Web5ContextProvider } from './context/Web5Context';
import { RootPage } from './features/app/root/RootPage';
import { IndexPage } from './features/app/IndexPage';
import { VerifiableCredentialsPage } from './features/credentials/VerifiableCredentialsPage';
import { OngoingOrdersPage } from './features/orders/OngoingOrdersPage';
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
        element: <OngoingOrdersPage />,
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
        path: '/offering',
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
