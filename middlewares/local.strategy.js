const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user'); 
const bcrypt = require('bcrypt');
const passport = require('passport');

const localStrategy = new LocalStrategy({
    usernameField: 'username',
    passReqToCallback: true // This allows you to access req in the callback
}, async (req, username, password, done) => {
    try {
        const user = await User.findOne({ where: { user_name: username } });
        if (user) {
            const passwordIsSame = await bcrypt.compare(password, user.password);
            if (passwordIsSame) {
                return done(null, user); // Password matches, proceed with the user
            } else {
                console.log("Password does not match");
                req.flash('message', 'Please enter a valid password!');
                return done(null, false); // Password does not match
            }
        } else {
            console.log("User does not exist");
            req.flash('message', 'User with this username does not exist!');
            return done(null, false); // User does not exist
        }
    } catch (err) {
        console.log(err);
        req.flash('message', 'An error occurred during the query!');
        return done(err, null); // Error occurred during the query
    }
});

passport.serializeUser(function (user, done) {
    done(null, user.id); // Serialize the user ID into the session
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findByPk(id);
        if (user) {
            done(null, user); // Deserialize the user object
        } else {
            done(null, false); // User not found
        }
    } catch (err) {
        done(err, null); // Error occurred during the query
    }
});

module.exports = localStrategy;

