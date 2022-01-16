const mongoose = require('mongoose');
const User_Schema = mongoose.Schema({
    user: {
        type: Object,
        require: true,
    },
    geoData: {
        type: Object,
        require: true,
    },
    email: {
        type: Object,
        require: true,
    },
    legal: {
        type: Object,
        require: true,
    },
    date: {
        type: Object,
        require: true,
    }
});

const User_Model = mongoose.model('User', User_Schema);
module.exports = User_Model;