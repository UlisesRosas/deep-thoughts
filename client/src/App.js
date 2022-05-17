import React from 'react';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
// ApolloProvider is a special type of React component that we'll use to provide data to all of the other components.
// ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.
// InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
// createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// establish link to graphql server
// NOTE: This would cause an error in production
// const httpLink = createHttpLink({
  // establishes connection to Api endpoint
//   uri: 'http://localhost:3001/graphql',
// });

// this end point will work in production and in development by using a relative path
// which will use whatever value is provided to it
const httpLink = createHttpLink({
  uri: '/graphql',
});

// instatiates client instance
const client = new ApolloClient({
  link: httpLink,
  // this is what we imported at the top of the file. this instantiates the cache object
  cache: new InMemoryCache(),
});

function App() {
  return (
    // passing in the client variables thoru this ApolloProvider
    <ApolloProvider client={client}>
    <div className="flex-column justify-flex-start min-100-vh">
      <Header />
      <div className="container">
        <Home />
      </div>
      <Footer />
    </div>
  </ApolloProvider>
  );
}

export default App;
