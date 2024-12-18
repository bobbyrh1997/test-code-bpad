const mongoose = require('mongoose')
const { Schema } = mongoose

let brandsCategory = new Schema({
    brand_id : {
        type : mongoose.Schema.Types.ObjectId
    },
    name_pm : {
        type : String
    },
    email_pm : {
        type : String
    },
    status : {
        type : Number
    },
    user_id : {
        type : String
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date
    }
})

module.exports = mongoose.model('brandsCategory',brandsCategory,'brandsCategory');

