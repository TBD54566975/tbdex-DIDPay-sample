import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Web5ContextProvider } from './context/Web5Context';
import { RootPage } from './features/app/root/RootPage';
import { RootPageTailwind } from './features/app/root/RootPageTailwind';
import { IndexPage } from './features/app/IndexPage';
import { VerifiableCredentialsPage } from './features/credentials/VerifiableCredentialsPage';
import { VerifiableCredentialsPageTailwind } from './features/credentials/VerifiableCredentialsPageTailwind';
import { OfferingsPage } from './features/offerings/OfferingsPage';
import { OfferingsPageTailwind } from './features/offerings/OfferingsPageTailwind';
import { QuotesPage } from './features/quotes/QuotesPage';
import { OrdersPage } from './features/orders/OrdersPage';
import { OrdersPageTailwind } from './features/orders/OrdersPageTailwind';
import { ProfilePage } from './features/profile/Profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPageTailwind />,
    children: [
      {
        index: true,
        element: <OfferingsPageTailwind />,
      },
      {
        path: '/verifiablecredentials',
        element: <VerifiableCredentialsPageTailwind />,
      },
      {
        path: '/orders',
        element: <OrdersPageTailwind />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
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
