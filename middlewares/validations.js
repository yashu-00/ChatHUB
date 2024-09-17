const user = require('../models/user');

async function validation(req, res, next) {
    const { name, username, password, number, email } = req.body;

    // Check for validation errors
    if (!name) {
        req.flash('message', 'Name is required.');
        req.session.user = req.body;  // Store the user input in session
        return res.redirect('/auth/signUp'); // No object passed to redirect
    }
    if (name.length < 2) {
        req.flash('message', 'Name should have at least 2 characters.');
        req.session.user = req.body;
        return res.redirect('/auth/signUp');
    }
    if (!email) {
        req.flash('message', 'Email is required.');
        req.session.user = req.body;
        return res.redirect('/auth/signUp');
    }
    if (!username) {
        req.flash('message', 'Username is required.');
        req.session.user = req.body;
        return res.redirect('/auth/signUp');
    }
    if (username.length < 3) {
        req.flash('message', 'Username should have at least 3 characters.');
        req.session.user = req.body;
        return res.redirect('/auth/signUp');
    }
    if (!password) {
        req.flash('message', 'Password is required.');
        req.session.user = req.body;
        return res.redirect('/auth/signUp');
    }
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-={}|:;<>?,./]).{8}$/;
    if (!pattern.test(password)) {
        req.flash('message', 'Password should have 1 special character, 1 lowercase letter, 1 lowercase letter and length should be 8');
        req.session.user = req.body;
        return res.redirect('/auth/signUp');
    }
    if (!number) {
        req.flash('message', 'Number is required.');
        req.session.user = req.body;
        return res.redirect('/auth/signUp');
    }
    if (number.length != 10) {
        req.flash('message', 'Number should have 10 digits.');
        req.session.user = req.body;
        return res.redirect('/auth/signUp');
    }

    try {
        let result = await user.findOne({
            where: { user_name: username }
        });
        if (result) {
            req.flash('message', 'Username is already in use.');
            req.session.user = req.body;
            return res.redirect('/auth/signUp');
        }
        next();
    } catch (err) {
        console.log(err);
        req.flash('error', 'Something went wrong, please try again.');
        req.session.user = req.body;
        return res.redirect('/auth/signUp');
    }
}

module.exports = validation;
