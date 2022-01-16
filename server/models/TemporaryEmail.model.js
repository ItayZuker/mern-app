const mongoose = require('mongoose');
const Temporary_Email_Schema = mongoose.Schema({
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

const Temporary_Email_Model = mongoose.model('temporary-email', Temporary_Email_Schema);
module.exports = Temporary_Email_Model;