import React from 'react';
// components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
// these libraries will enable the creation of routes
// 'as' renames 'BriwserRouter with the following names'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// ApolloProvider is a special type of React component that we'll use to provide data to all of the other components.
// ApolloClient is a constructor function that will help initialize the connection to the GraphQL API server.
// InMemoryCache enables the Apollo Client instance to cache API response data so that we can perform requests more efficiently.
// createHttpLink allows us to control how the Apollo Client makes a request. Think of it like middleware for the outbound network requests.
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// tells appolo to retrieve this token every time we make an graphql request
import { setContext } from '@apollo/client/link/context';

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

// middlewear function that retrieves the tokenand use/combine with existing httpLink
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// instatiates client instance and sets request headers with auth token
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    // passing client variables throgh Apollo provider
    <ApolloProvider client={client}>
      {/* "Router" allows us to use "Routes" and render components through routes different paths that change state */}
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            {/* within Routes we have a "Route" or multiple "Routes" */}
            <Routes>
              {/* one route will direct page to render a component */}
              <Route
                // this path assigns the path to the element below
                path="/"
                // this element will render when the specific path is detected
                element={<Home />}
              />
              <Route
                path="/login"
                element={<Login />}
              />
              <Route
                path="/signup"
                element={<Signup />}
              />
              <Route
              // here our route has a param specified after the ':' and the '?' means its optional
                path="/profile/:username?"
                element={<Profile />}
              />
              <Route
                path="/thought/:id"
                element={<SingleThought />}
              />
              <Route
                path="*"
                element={<NoMatch />}
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
