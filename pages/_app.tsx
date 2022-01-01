import '../styles/tailwind.css'
import '../styles/global.css'
import { AppProps } from 'next/app'
import { GoogleAnalytics, usePagesViews } from 'nextjs-google-analytics'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'

// Shared query client for react-query.
const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps) {
  // Track route changes.
  usePagesViews()

  return (
    <React.Fragment>
      <GoogleAnalytics />

      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </React.Fragment>
  )
}

export default App
