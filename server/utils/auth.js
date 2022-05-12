// importing json web token for auth
const jwt = require('jsonwebtoken');

// the secret allows the servert to recognize the token 
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
    // this expects a user object
    signToken: function ({ username, email, _id }) {
        const payload = { username, email, _id };

        return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    },

    // header logic
    authMiddleware: function ({ req }) {
        // allows token to be sent via req.body, req.query, or headers
        let token = req.body.token || req.query.token || req.headers.authorization;

        // separate "Bearer" from "<tokenvalue>"
        if (req.headers.authorization) {
            token = token
                .split(' ')
                .pop()
                .trim();
        }

        // if no token, return request object as is
        if (!token) {
            return req;
        }

        try {
            // decode and attach user data to request object
            // the secret here has to match the secret in jwt.sign() for it to authenticat
            const { data } = jwt.verify(token, secret, { maxAge: expiration });
            req.user = data;
        } catch {
            console.log('Invalid token');
        }

        // return updated request object
        return req;
    }

};