const mongoose = require('mongoose');
const Email_Verification_Schema = mongoose.Schema({
    email: {
        type: String,
        require: true,
    },
    encryptedPassword: {
        type: String,
        require: true,
    },
    lifeTime: {
        type: Number,
        require: true,
    },
    date: {
        type: Date,
        require: true,
    }
});

const Email_Verification_Model = mongoose.model('Verification', Email_Verification_Schema);
module.exports = Email_Verification_Model;