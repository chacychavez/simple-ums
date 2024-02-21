import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({defaultOptions: {
  queries: {
    staleTime: 3600 * 1000, // 1 hour
    refetchOnWindowFocus: false, // default: true
  },
},})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
