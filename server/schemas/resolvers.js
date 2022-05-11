// this file serves the response from the request made in the typedef

// import models
const { User, Thought } = require('../models');

// object 
// NOTE: Apollo will handle error handleing 
const resolvers = {
    Query: {
        thoughts: async (psrent, { username }) => {
            //   this allows parameters to query with a username
            // the '?' ternary orerater checks to see if the username exists if it does
            // it sets a key for an object with that username
            // if not it returns an empty object and a look up of every user will occur
            const params = username ? { username } : {};
            //   perform a find() method on data and sort it in decending order
            return Thought.find().sort({ createdAt: -1 });
        },
        // destructured the id to pass it as a parameter to find one thought and use the 'findOne' method
        thought: async (parent, { _id }) => {
            return Thought.findOne({ _id });
        },
        // get all users
        users: async () => {
            return User.find()
                // removing this data from result
                .select('-__v -password')
                // this populates our associated data
                .populate('friends')
                .populate('thoughts');
        },
        // get a user by username
        user: async (parent, { username }) => {
            return User.findOne({ username })
                // removing this data from result
                .select('-__v -password')
                // this populates our associated data
                .populate('friends')
                .populate('thoughts');
        },

    }
};

module.exports = resolvers;