const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

// auth middleware function
const { authMiddleware } = require('./utils/auth');

// This will allow us to conect the back end to the front end and render requests
const path = require('path');

const PORT = process.env.PORT || 3001;
// create a new instance of Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // this returns only the headers of an incoming request eith a method defined in auth file
  context: authMiddleware
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
await server.start();
// integrate our Apollo server with the Express application as middleware
server.applyMiddleware({ app });

// Serve up static assets
// NOTE:only work durring production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
// NOTE:only work durring production
// this wild card serves production ready front end code for any GET request without a specific route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // log where we can go to test our GQL API
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    })
  })
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);