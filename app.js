const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const TweetRoute = require('./routes/tweets');

const CONNECTION_URI = process.env.MONGODB_URI || 'mongodb://localhost/Twitter';

mongoose.connect(CONNECTION_URI,{useNewUrlParser: true, useUnifiedTopology: true})
let db = mongoose.connection;

db.once('open',function(){
    console.log('Connected to mongodb....')
});
db.on('error',function(err){
    console.log(err);
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});

app.use('/tweets',TweetRoute);

module.exports = app;