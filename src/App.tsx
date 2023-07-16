import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Web5ContextProvider } from './context/Web5Context'
import { RootPage } from './features/app/root/RootPage'
import { VerifiableCredentialsPage } from './features/credentials/VerifiableCredentialsPage'
import { ThreadsPage } from './features/threads/ThreadsPage'
import { HistoryPage } from './features/history/HistoryPage'
import { OfferingsPage } from './features/offerings/OfferingsPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        element: <ThreadsPage />,
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
])

export default function App() {
  return (
    <Web5ContextProvider>
      <RouterProvider router={router} />
    </Web5ContextProvider>
  )
}
