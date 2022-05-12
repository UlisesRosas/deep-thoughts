// NOTE: we need apollo to be able to use graphql eith JS
// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs query that will return an array. The data type "typeThought" is custom
// the atuff in the back ticks is called a tagged template function
// type Query is getting data we use type mutation for post, update and delete requests
// we define each custom datatype before we put it in the query
// below query we have a mutation that is for request for data that gets altered such as creatind a user
// 'me' is an authentication token 
const typeDefs = gql`
type Thought {
    _id: ID
    thoughtText: String
    createdAt: String
    username: String
    reactionCount: Int
    reactions: [Reaction]
  }
  type Reaction {
    _id: ID
    reactionBody: String
    createdAt: String
    username: String
  }
  type User {
    _id: ID
    username: String
    email: String
    friendCount: Int
    thoughts: [Thought]
    friends: [User]
  }
  type Auth {
    token: ID!
    user: User
  }
    type Query {
        me: User
        users: [User]
        user(username: String!): User
        thoughts(username: String): [Thought]
        thought(_id: ID!): Thought
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    addThought(thoughtText: String!): Thought
    addReaction(thoughtId: ID!, reactionBody: String!): Thought
    addFriend(friendId: ID!): User
  }`
  ;

// export the typeDefs
module.exports = typeDefs;