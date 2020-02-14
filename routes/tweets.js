const express = require('express');
const router = express.Router();

const Twitter = require('twit');

const Tweets = require('../models/tweets-model');
const config = require('../models/config');

const apiclient = new Twitter(config);


router.post('/', (req, res) => {
    Tweets.find({Name : req.body.name}).then(result =>{
        if(result.length > 0){
            return res.status(200).json({
                message: "Message found",
                result : result
            });
        }
        let tweetsArray = [];    
        apiclient.get('search/tweets', { q: req.body.name, count : 10, result_type: 'mixed' }, (err, data, response) => {
            if(data.statuses.length == 0){
                return res.status(200).json({
                    message : 'No tweets found / No username found',
                    result : [data]
                })
            }
            if(err) throw err
            for(let i = 0; i < data.statuses.length; i++){
                tweetsArray.push(data.statuses[i].text);
            }
            console.log(data);
            new Tweets({
                Name : req.body.name,
                Tweets : tweetsArray
            })
            .save()
            .then(result =>{
                res.status(200).json({
                    message : "Inserted successfully",
                    result : [result]
                });
            })
            .catch(err =>{
                res.status(500).json({
                    message : "Oops something went wrong..",
                    error: err
                });
            });
        });   
    }); 
});

module.exports = router;

