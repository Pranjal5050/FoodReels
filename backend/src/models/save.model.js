const mongoose = require('mongoose');

const saveSchema = mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
       foodId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'food',
        required : true
    },
}, {
    timestamps : true
})

module.exports = mongoose.model('save', saveSchema)