const mongoose = require('mongoose');
require('dotenv').config();

const dbURL = process.env.MONGODB_ACCESS;

mongoose.connect(dbURL, {useNewUrlParser: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("mongoDb is connected");
});