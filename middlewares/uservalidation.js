const user = require('../models/user');

async function validation(req, res, next) {
    const { name, username, number, email } = req.body;
    console.log(name,req.body)
    // Validation checks
    if (!name) {
        req.flash('message', 'Name is required.');
        return res.redirect('/users/editProfile'); // Redirect to the editProfile route
    }
    if (name.length < 2) {
        req.flash('message', 'Name should have at least 2 characters.');
        return res.redirect('/users/editProfile');
    }
    if (!email) {
        req.flash('message', 'Email is required.');
        return res.redirect('/users/editProfile');
    }
    if (!username) {
        req.flash('message', 'Username is required.');
        return res.redirect('/users/editProfile');
    }
    if (username.length < 3) {
        req.flash('message', 'Username should have at least 3 characters.');
        return res.redirect('/users/editProfile');
    }
    if (!number) {
        req.flash('message', 'Number is required.');
        return res.redirect('/users/editProfile');
    }
    if (number.length !== 10) {
        req.flash('message', 'Number should have 10 digits.');
        return res.redirect('/users/editProfile');
    }

    try {
        let result = await user.findOne({
            where: { user_name: username }
        });

        if (result && result.user_name != req.user.user_name) {
            req.flash('message', 'Username is already in use.');
            return res.redirect('/users/editProfile');
        }

        next();

    } catch (err) {
        console.log(err);
        req.flash('error', 'Something went wrong, please try again.');
        return res.redirect('/users/editProfile');
    }
}

module.exports = validation;
