const mongoose = require('mongoose');

module.exports = mongoose.model('Tweets',mongoose.Schema({
    Name : String,
    Tweets : [String]
}));