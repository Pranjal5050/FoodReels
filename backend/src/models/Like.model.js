const { default: mongoose } = require('mongoose');
const monoose = require('mongoose');

const likeSchema = monoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user',
        required : true
    },
    foodId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'food',
        required : true
    }
}, {
    timestamps : true
})

module.exports = monoose.model('like', likeSchema);