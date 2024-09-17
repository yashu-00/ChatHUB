const USER = require('../models/user')
const sms = require('../models/sms')
const { sendOTPEmail, sendForgotOTP } = require('../email')
const bcrypt = require('bcrypt')
const { USE } = require('sequelize/lib/index-hints')
const fetch = require('node-fetch');
const { where } = require('sequelize')
const Captcha = require('node-captcha-generator')
const OTP = require('../models/otp')

async function imagecaptcha(req, res) {
    var c = new Captcha({
        length: 5, // number length
        size: {    // output size
            width: 300,
            height: 50
        }
    });
    await c.toBase64(async (err, base64) => {
        if (err) {
            console.log(err);
        }
        else {
            cap = c.value;
            req.session.cap = cap;
            console.log(req.session.cap)
            res.render('auth/otp', { message: req.flash('message'), imagepath: base64 });
        }
    })
};

const indexMethods = {
    showSignUp: (req, res) => {
        const user = req.session.user || {};
        req.session.user = null;
        res.render('auth/signup', { user: user, message: req.flash('message') });
    },

    createUser: async (req, res) => {
        try {
            let data = req.body
            req.session.user = req.body

            //generate otps
            const otp = Math.floor(1111 + Math.random() * (9999 - 1111 + 1));
            req.session.otp = otp
            sendOTPEmail(data.email, otp, data.name)
            return res.redirect('/auth/otp')
        } catch (err) {
            req.flash('error', err + 'Something went wrong, please try again!')
            return res.redirect('/auth/signup');
        }
    },

    showOTP: (req, res) => {
        imagecaptcha(req, res);
    },

    verifyOTP: async (req, res) => {
        const data = req.body;
        const Captcha = data.captcha
        console.log(Captcha)
        const cap = req.session.cap
        if (cap == Captcha) {
            try {

                if (data.otp == req.session.otp) {
                    req.flash('message', 'User registered successfully');
                    const hashPassword = await bcrypt.hash(req.session.password, 10);
                    const user = new USER()
                    user.name = req.session.name
                    user.user_name = req.session.username
                    user.password = hashPassword
                    user.number = req.session.number
                    user.email = req.session.email
                    await user.save();
                    return res.redirect('/auth/login');
                } else {
                    req.flash('message', 'Incorrect OTP');
                    res.redirect('/auth/otp')
                }
            } catch (err) {
                req.flash('error', err.message);
                res.render('auth/otp', { message: req.flash('error') });
            }
        } else {
            req.flash('message', 'Invalid Captcha! try again');
            imagecaptcha(req, res);
        }
    },

    showLogin: (req, res) => {
        res.render('auth/login', { message: req.flash('message') })
    },

    verifyUser: async (req, res) => {
        sms('9817411503', req.user)
        req.session.user = null
        res.redirect('/users/friends')
    },

    showForgotPage: (req, res) => {
        res.render('auth/forgot', { message: req.flash('message') })
    },


    forgotPassword: async (req, res) => {
        const { user_name, password } = req.body;
        try {
            let result = await USER.findOne({
                where: {
                    user_name: user_name
                }
            });

            if (!result) {
                req.flash('message', "User name doesn't exist");
                return res.redirect('/auth/forgot');
            } else {
                const otp = Math.floor(1111 + Math.random() * (9999 - 1111 + 1));
                req.session.otp = otp;
                req.session.pass = password;
                req.session.user_name = user_name
                sendForgotOTP(result.email, otp)
                return res.redirect('/auth/forgotOTP')
            }
        } catch (err) {
            console.log(err);
            req.flash('error', 'Something went wrong, please try again');
            return res.render('auth/login', { message: req.flash('error') });
        }

    },

    showForgotOtp: (req, res) => {
        res.render('auth/forgotOTP', { message: req.flash('message') })
    },

    verifyForgotOTP: async (req, res) => {
        if (req.session.otp == req.body.otp) {
            let hashPassword = await bcrypt.hash(req.session.pass, 10);
            await USER.update(
                { password: hashPassword },
                {
                    where: { user_name: req.session.user_name }
                }
            );
            req.flash('message', "Password is reset");
            return res.redirect('/auth/login');
        } else {
            req.flash('message', "OTP is not correct");
            return res.redirect('/auth/forgetOTP');
        }
    },

    loggingOut: (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error logging out.');
            }
            res.clearCookie('connect.sid');
            res.redirect('/login');
        });
        req.logOut();
    }
}
module.exports = indexMethods