const mongoose = require('mongoose')

const userschema = mongoose.Schema({
    fullname: {
        firstname : {
            type : String,
            required : true
        },
        lastname : {
            type : String,
        }
    },

    email: {
        type: String,
        required: true,
        unique: true,
    }, 

    password: {
        type: String
    },
},
    {
        timestamps: true
    }
)

const usermodle = mongoose.model("user", userschema)

module.exports = usermodle