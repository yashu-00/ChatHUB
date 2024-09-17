const nodemailer = require('nodemailer');

// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'yash011033@gmail.com',
        pass: 'lrhg kupq lcxv wujs'
    }
});

const sendOTPEmail = (email, otp, name) => {
    const mailOptions = {
        from: 'yash011033@gmail.com',
        to: email,
        subject: 'ChatHUB verification code',
        text: `Welcome ${name} to ChatHUB!\nPlease enter your otp code to verify your email.\nYour otp is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
};

const sendForgotOTP = (email, otp) => {
    const mailOptions = {
        from: 'yash011033@gmail.com',
        to: email,
        subject: 'Changing Password Code',
        text: `Please enter your otp code to verify it's you.\nYour otp is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}; 
module.exports = {sendOTPEmail,sendForgotOTP};