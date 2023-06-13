import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Web5ContextProvider } from './context/Web5Context';
import { RootPage } from './features/app/root/RootPage';
import { IndexPage } from './features/app/IndexPage';
import { VerifiableCredentialsPage } from './features/credentials/VerifiableCredentialsPage';
import { OfferingsPage } from './features/offerings/OfferingsPage';
import { QuotesPage } from './features/quotes/QuotesPage';
import { OrdersPage } from './features/orders/OrdersPage';
import { ProfilePage } from './features/profile/Profile';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: '/verifiablecredentials',
        element: <VerifiableCredentialsPage />,
      },
      {
        path: '/offerings',
        element: <OfferingsPage />,
      },
      {
        path: '/quotes',
        element: <QuotesPage />,
      },
      {
        path: '/orders',
        element: <OrdersPage />,
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
