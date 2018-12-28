/**
 * authentication service
 * it responsible to init passport,
 * registration,
 * login,
 * fast check if user exist
 */

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// get userservice for the db access
const userModel = require('../data/schemas/Users');

let _passport;

// expose this function to our app using module.exports
module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        userModel.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            return userModel.findOne({
                    'local.email': email
                })
                .then((user) => {
                    if (user) {
                        return done(null, false);
                    }
                    // if there is no user with that email
                    // create the user
                    var newUser = new userModel();

                    // set the user's local credentials
                    newUser.local.email = email;
                    newUser.local.password = newUser.generateHash(password);

                    // save the user
                    return newUser.save();
                })
                .then((newUser) => {
                    return done(null, newUser);
                })
                .catch((err) => {
                    return done(err);
                })
        }));

    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function (req, email, password, done) { // callback with email and password from our form
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            return userModel.findOne({
                    'local.email': email
                })
                .then((user) => {
                    // if no user is found, return the message
                    if (!user)
                        return done(null, false);

                    // if the user is found but the password is wrong
                    if (!user.validPassword(password))
                        return done(null, false);

                    return done(null, user);
                })
                .catch((err) => {
                    return done(err);
                })
        }));

    _passport = passport;

};

module.exports.register = (req, res, next) => {
    _passport.authenticate('local-signup', (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        // case user is already exist in db and we dont want to register it again
        if (user === false) {
            return res.status(400).send('user already registered to WeMeet');
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                console.log(loginErr);
                return res.status(500).send(false);
            }
            let {
                email
            } = user.local;
            return res.status(200).send({
                email
            });
        })
    })(req, res, next);
};

module.exports.login = (req, res, next) => {
    _passport.authenticate('local-login', (err, user) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        // case couldn't login the user
        if (user === false) {
            return res.status(400).send(false);
        }
        req.login(user, (loginErr) => {
            if (loginErr) {
                console.log(loginErr);
                return res.status(500).send(false);
            }
            let {
                email
            } = user.local;
            return res.status(200).send({
                email
            });
        })
    })(req, res, next);
};

module.exports.isUserExist = (req, res, next) => {
    return userModel.count({
            'local.email': req.body.email
        })
        .then((users) => {
            if (users > 0) {
                return res.status(200).send(true);
            }
            return res.status(200).send(false);
        })
        .catch((err) => {
            console.log(err);
            return res.status(500).send(false);
        })
}