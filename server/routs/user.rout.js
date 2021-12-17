const express = require('express');
const router = express.Router();
const Email_Verification_Model = require('../models/EmailVerification.model.js');
const generator = require('generate-password');
const bcrypt = require('bcrypt');
const validator = require('email-validator');
const nodemailer = require('nodemailer');


/* Router functions */
const getTemporaryPassword = () => {
    return new Promise((resolve, reject) => {
        const password = generator.generate({
            length: 6,
            numbers: true
        })
        if (password) {
            resolve(password);
        } else {
            reject('Problem generating password');
        }
    });
};

const getEncryptedPassword = (passwordString) => {
    return new Promise((resolve, reject) => {
        const saltRounds = 10;
        bcrypt.hash(passwordString, saltRounds, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
};

const validateEmail = (emailString) => {
    return new Promise((resolve, reject) => {
        const validation = validator.validate(emailString);
        if (validation) {
            resolve(true);
        } else {
            reject('Problem with email');
        }
    });
};

const setItemTermination = (verificationItem) => {
        const id = verificationItem._id.toString();
        setTimeout(async () => {
            const deletedItem = await Email_Verification_Model
                .findOneAndDelete({_id: id}).exec();
            console.log('Lifetime expired for: '+ deletedItem.email);
        }, verificationItem.lifeTime);

};

const getMinutesLifetime = (seconds) => {
    return new Promise(resolve => {
        const minutes = Math.floor(seconds / 600000)
        resolve(minutes);
    });
};

const sendVerificationEmail = (verificationItem, temporaryPassword) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: process.env.NODE_MAILER_SERVICE,
            auth: {
                user: process.env.NODE_MAILER_USER,
                pass: process.env.NODE_MAILER_PASS
            }
        })
        const mailOptions = {
            from: 'mern.app.data@gmail.com',
            to: verificationItem.email,
            subject: 'Email verification',
            text: 'Your password is: ' + temporaryPassword
        };
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                reject();
            } else {
                console.log('Email sent: ' + info.response);
                resolve();
            }
        });
    });
};


/* Router routs */
router.post('/verify-email', async ( req, res ) => {
    try {

        /* Verify email */
        await validateEmail(req.body.email);

        const second = 10000;
        const minute = second * 60;
        const lifeTime = minute * 5;

        /* Try to build a new email verification item */
        const temporaryPassword = await getTemporaryPassword();
        const encryptedPassword = await getEncryptedPassword(temporaryPassword);
        const emailVerificationItem = {
            email: req.body.email,
            encryptedPassword: encryptedPassword,
            lifeTime: lifeTime,
            date: new Date()
        };

        /* Find if the email is currently in use in temporary database verification collection, and delete if true */
        Email_Verification_Model
            .findOneAndDelete({
                email: req.body.email
            }, (err, verificationItem) => {
                if (err) {
                    res.status(500).send(err);
                } else if (verificationItem) {
                    console.log('Email duplication was found in temporary database, and was deleted');
                } else {
                    console.log('No email duplication was found');
                }
            });

        /* Create a new (Temporary) email verification item in database, with new hash password */
        await Email_Verification_Model
            .create({
                email: emailVerificationItem.email,
                encryptedPassword: emailVerificationItem.encryptedPassword,
                lifeTime: emailVerificationItem.lifeTime,
                date: emailVerificationItem.date,
            }, async (err, verificationItem) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    setItemTermination(verificationItem);
                    const minutesLifetime = await getMinutesLifetime(emailVerificationItem.lifeTime);
                    await sendVerificationEmail(verificationItem, temporaryPassword);
                    res.status(200).json({
                        message: 'Verification password was sent to your email',
                        warning: 'Password will be deleted in: ' + minutesLifetime + ' minutes'
                        });
                }
            });

    } catch ( err ) {
        res.status( 500 ).send( err );
    }
});


module.exports = router;