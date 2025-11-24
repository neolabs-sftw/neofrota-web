import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TemaProvider } from "./hooks/temaContext.tsx";
import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

// Forma nova e oficial (sem warning)
const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  // uri: 'https://api.neofrota.com.br/graphql',
  // uri: 'https://neofrotaapitemp-1.onrender.com/graphql',
  credentials: "include", // se você usa cookies/auth
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  // opcional: desativa o warning completamente enquanto não migra (se quiser)
  defaultOptions: {
    watchQuery: { fetchPolicy: "cache-and-network" },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <TemaProvider>
        <App />
      </TemaProvider>
    </ApolloProvider>
  </StrictMode>
);
