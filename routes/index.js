const express = require('express')
const router = express.Router()
const validation = require('../middlewares/validations')
const indexMethods = require('../controllers/indexController')
const passport = require('passport')

router.get('/signUp', indexMethods.showSignUp)
router.post('/signUp', validation, indexMethods.createUser)
router.get('/otp',indexMethods.showOTP)
router.post('/otp',indexMethods.verifyOTP)
router.get('/login',indexMethods.showLogin)
router.post('/loginn',passport.authenticate('local', { failureRedirect: '/auth/login'}),indexMethods.verifyUser)
router.get('/forgot',indexMethods.showForgotPage)
router.post('/forgot',indexMethods.forgotPassword)
router.get('/forgotOTP',indexMethods.showForgotOtp)
router.post('/forgotOTP',indexMethods.verifyForgotOTP)
router.get('/logout', indexMethods.loggingOut);

module.exports = router;