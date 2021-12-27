import '../styles/tailwind.css'
import { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'

// Shared query client for react-query.
const queryClient = new QueryClient()

function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}

export default App
