const mongoose = require('mongoose')

function connectdb(){
    mongoose.connect(process.env.DB_URL)
    .then(function(){
        console.log("mongoDb connected")
    })

    .catch(function(err){
        console.log("mongoDB connection error", err);
    })
}

module.exports = connectdb

