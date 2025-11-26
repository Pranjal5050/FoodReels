const mongoose = require('mongoose')

const foodPartnerschema = mongoose.Schema({
    businessname: {
        type : String,
        required: true
    },
    contactname: {
        type : String,
        required: true
    },
    phone : {
        type : Number,
        required : true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    }, 
    password: {
        type: String
    },
    address: {
        type: String,
        required : true
    },
})

const foodPartnermodle = mongoose.model("foodPartner", foodPartnerschema)

module.exports = foodPartnermodle