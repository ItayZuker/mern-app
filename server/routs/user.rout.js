const express = require('express');
const router = express.Router();
const Temporary_Email_Model = require('../models/TemporaryEmail.model.js');
const Verified_Email_Model = require('../models/VerifiedEmail.model.js');
const User_Model = require('../models/user.model.js');
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

const setTemporaryItemTermination = (verificationItem) => {
    setTimeout(async () => {
        const id = verificationItem._id.toString();
        const deletedItem = await Temporary_Email_Model
            .findOneAndDelete({_id: id}).exec();
        if (!!deletedItem) {
            console.log('Lifetime expired for: ' + deletedItem.email);
        } else {
            console.log('Lifetime irrelevant for ID: ' + id + ' ---> Item was already deleted because of email duplication with: ' + verificationItem.email);
        }
    }, verificationItem.lifeTime);
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
                resolve(false);
            } else {
                console.log('Email sent: ' + info.response);
                resolve(true);
            }
        });
    });
};

const checkPassword = (emailPassword, encryptedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(emailPassword, encryptedPassword, (err, result) => {
            if(err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

const createVerifiedEmailItem = (verifiedEmail) => {
    return new Promise(async (resolve, reject) => {

        /* Find if email item is already verified and saved id database */
        const dbItem = await Verified_Email_Model
            .findOne({email: verifiedEmail.email}).exec();
        if(!!dbItem) {
            resolve(verifiedEmail.email);
        } else {

            /* Create a new verified email item in database */
            Verified_Email_Model
                .create({
                    email: verifiedEmail.email,
                    date: verifiedEmail.date,
                }, (err, verifiedEmailItem) => {
                    if (err) {
                        console.log(err)
                        reject('Something went wrong: Email was not saved in verified emails collection');
                    } else if(!verifiedEmailItem) {
                        reject('Something went wrong: Email was not saved in verified emails collection');
                    } else {
                        resolve(verifiedEmailItem.email);
                    }
                });
        }
    });
};

const createUserItem = (userData) => {
    return new Promise((resolve, reject) => {

        /* Create new user item, in permanent app database */
        User_Model
            .create({
                user: {
                    name: 'User',
                    gender: 'none',
                    birth: {
                        day: {
                            string: '',
                            number: null,
                        },
                        month: {
                            string: '',
                            number: null,
                        },
                        year: {
                            string: '',
                            number: null,
                        },
                    },
                },
                country: {
                    string: '',
                    code: '',
                    iso: '',
                },
                email: {
                    string: userData.email.string,
                    verified: userData.email.verified,
                },
                legal: {
                    content: userData.legal.content,
                    agree: userData.legal.agree,
                },
                date: {
                    userStart: userData.date
                }

            }, async (err, userItem) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else if(!!userItem){
                    resolve(userItem);
                } else {
                    resolve(false);
                }
            });
    });
};

const validateUserData = (data) => {
    return new Promise((resolve, reject) => {
        if(!data.legal.agree) {
            reject('User did not agree to terms');
        } else if(!data.email.string) {
            reject('Email is missing');
        } else if(!data.email.verified) {
            reject('Email was not verified');
        } else {
            resolve();
        }
    });
};

/* Router routs */
router.post('/verify-email', async ( req, res ) => {
    try {

        /* Verify email */
        await validateEmail(req.body.email);

        /* Define verification item lifetime in database */
        const second = 1000;
        const minute = second * 60;
        const lifeTime = minute * 2;

        /* Generate new password and encrypted password */
        const temporaryPassword = await getTemporaryPassword();
        const encryptedPassword = await getEncryptedPassword(temporaryPassword);

        /* Build a new item */
        const item = {
            email: req.body.email,
            encryptedPassword: encryptedPassword,
            lifeTime: lifeTime,
            date: req.body.date
        };

        /* Find if the email is currently in use in temporary database verification collection, and delete if true */
        Temporary_Email_Model
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
        await Temporary_Email_Model
            .create({
                email: item.email,
                encryptedPassword: item.encryptedPassword,
                lifeTime: item.lifeTime,
                date: item.date,
            }, async (err, TemporaryItemItem) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    setTemporaryItemTermination(TemporaryItemItem);
                    const emailSent = await sendVerificationEmail(TemporaryItemItem, temporaryPassword);
                    if(emailSent) {
                        res.status(200).json({
                            passwordSent: true,
                            message: 'Password was sent to your email',
                            passwordLifetime: item.lifeTime,
                            passwordSize: temporaryPassword.length,
                            stage: 'validate'
                        });
                    } else {
                        res.status(200).json({
                            passwordSent: false,
                            message: 'Something went wrong, please try again',
                            passwordLifetime: null,
                            passwordSize: null,
                            stage: 'validate'
                        });
                    }
                }
            });
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/verify-email-password', async ( req, res ) => {
    try {

        /* Build a new item */
        const item = {
            email: req.body.email,
            password: req.body.password,
            date: req.body.date
        };

        /* Find item with matching email in (Temporary) database */
        const dbItem = await Temporary_Email_Model
            .findOne({email: item.email}).exec();

        if(!!dbItem) {

            /* Decrypt password and compare */
            const match = await checkPassword(item.password, dbItem.encryptedPassword);

            if(match) {

                // save password in verified email db collection;
                const verifiedEmail = await createVerifiedEmailItem(item);

                if(!!verifiedEmail) {
                    res.status(200).json({
                        match: true,
                        email: verifiedEmail,
                        stage: 'signup',
                        message: 'Email verified'
                    });
                }
            } else {
                res.status(200).json({
                    match: false,
                    email: item.email,
                    stage: 'validate',
                    message: 'Wrong password',
                });
            }
        } else {
            res.status(200).json({
                match: false,
                email: '',
                stage: 'validate',
                message: 'No email in temporary DB',
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/signup', async ( req, res ) => {
    try {

        console.log(req.body.date)

        /* Verify req data */
        await validateUserData(req.body);

        /* Build a new item */
        const userData = {
            email: req.body.email,
            legal: req.body.legal,
            geoData: req.body.geoData,
            date: req.body.date,
        };

        /* Delete email item from verified email database */
        Verified_Email_Model
            .findOneAndDelete({
                email: userData.email.string
            }, async (err, item) => {
                if(err) {
                    res.status(500).send(err);
                } else if(!!item) {
                    const userItem = await createUserItem(userData);
                    if(!!userItem) {
                        res.status(200).json({
                            signup: true,
                            email: item.email,
                            stage: 'signup',
                            message: 'User created',
                        });
                    } else {
                        res.status(200).json({
                            signup: false,
                            email: item.email,
                            stage: 'signup',
                            message: 'Something thing went wrong: User was not created',
                        });
                    }
                } else {
                    res.status(200).json({
                        signup: false,
                        email: req.body.email.string,
                        stage: 'signup',
                        message: 'Email was not verified',
                    });
                }
            });

    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;