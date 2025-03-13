const passport = require('passport');
const passportJWT = require('passport-jwt');
const { Strategy, ExtractJwt } = passportJWT;
require('dotenv').config();
const User = require('../models/user');
const { admin } = require('./adminMiddleware');


const params = {
    secretOrKey: process.env.authSecret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const strategy = new Strategy(params, (payload, done) => {
    
    User.findByPk(payload.id)
        .then(user => {
            if (user) {
                return done(null, {
                    id: user.id,
                    email: user.email,
                    admin: user.admin
                });
            }
            return done(null, false);
        })
        .catch(error => done(error, null));
});

passport.use(strategy);

module.exports.authenticate=() => (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            return res.status(401).json({ message: err.message });
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        return next();
    })(req, res, next);
};