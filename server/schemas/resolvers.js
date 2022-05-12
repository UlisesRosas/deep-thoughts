// this file serves the response from the request made in the typedef similar to controllers or routes in a regular HTTP REST app

// import models
const { User, Thought } = require('../models');
// error handling for invalid log in cridentials
const { AuthenticationError } = require('apollo-server-express');
// importing the sign in token from the auth file
const { signToken } = require('../utils/auth');

// object 
// NOTE: Apollo will handle error handleing 
const resolvers = {
    // this object is for geting data
    Query: {
        // authentication query
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                    // ommits the users password
                    .select('-__v -password')
                    .populate('thoughts')
                    .populate('friends');

                return userData;
            }

            throw new AuthenticationError('Not logged in');
        },
        // two params are required so 'parent' is just a place holder that we dont actualy use
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

    },
    // this object is for altering data
    Mutation: {
        // 'args' holds the parent information
        addUser: async (parent, args) => {
            // here we create a user with the 'create()' method
            const user = await User.create(args);
            const token = signToken(user);
            return { token, user };
        },
        //   log in request for 'login' custom datatype
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                // this "AuthenticationError" method sends the error to the client
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                // this "AuthenticationError" method sends the error to the client
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
            return { token, user };
        },
        //   creating a thought
        addThought: async (parent, args, context) => {
            if (context.user) {
                const thought = await Thought.create({ ...args, username: context.user.username });
                //   updates the thougth associated to the User
                await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { thoughts: thought._id } },
                    { new: true }
                );

                return thought;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        //   create a reaction
        // context helps with being logged in
        addReaction: async (parent, { thoughtId, reactionBody }, context) => {
            if (context.user) {
                const updatedThought = await Thought.findOneAndUpdate(
                    { _id: thoughtId },
                    // updated the reactions aarray to have a new reaction
                    { $push: { reactions: { reactionBody, username: context.user.username } } },
                    { new: true, runValidators: true }
                );

                return updatedThought;
            }

            throw new AuthenticationError('You need to be logged in!');
        },
        //   adding friends
        addFriend: async (parent, { friendId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    // use add to set method on the array to prevent duplicate friends
                    { $addToSet: { friends: friendId } },
                    { new: true }
                ).populate('friends');

                return updatedUser;
            }

            throw new AuthenticationError('You need to be logged in!');
        }
    }
};

module.exports = resolvers;