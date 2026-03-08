import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from '@tanstack/react-router'
import { router as tanstackRouter } from './routes/router.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')).render(
<StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={tanstackRouter} context={{ queryClient }} />
      <Toaster position="top-center" reverseOrder={false} />
    </QueryClientProvider>
</StrictMode>,
)
