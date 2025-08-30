import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { TemaProvider } from './hooks/temaContext.tsx'
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  // uri: 'https://neofrotaservico.onrender.com/',
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
    <TemaProvider>
      <App />
    </TemaProvider>
    </ApolloProvider>
  </StrictMode>,
)
