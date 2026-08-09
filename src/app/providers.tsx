import React from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { store } from './store'
import { router } from './routes'

// Configured QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        const status = error?.response?.status || error?.status
        if (status === 429 || status === 400 || status === 401 || status === 403 || status === 404) {
          return false
        }
        return failureCount < 1
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: false,
    },
  },
})

const AppBootstrap: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    const root = window.document.documentElement
    const activeTheme = localStorage.getItem('theme') || 'light'
    if (activeTheme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [])

  return <>{children}</>
}

export const Providers: React.FC = () => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppBootstrap>
          <RouterProvider router={router} />
        </AppBootstrap>
        <Toaster position="top-right" reverseOrder={false} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ReduxProvider>
  )
}
