const mongoose = require('mongoose');
const Verified_Email_Schema = mongoose.Schema({
    email: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        require: true,
    }
});

const Verified_Email_Model = mongoose.model('Verified-email', Verified_Email_Schema);
module.exports = Verified_Email_Model;