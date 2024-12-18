const mongoose = require('mongoose')
const { Schema } = mongoose

let marketingSpending = new Schema({
    brand_id : {
        type : mongoose.Schema.Types.ObjectId
    },
    brand_code : {
        type : String
    },
    brand_name : {
        type : String
    },
    amount_monthly : {
        type : Number
    },
    amount_quarterly : {
        type : Number
    },
    currency : {
        type : String
    },
    platform : {
        type : String
    },
    createdAt : {
        type : Date
    },
    updatedAt : {
        type : Date
    },
    errorStatus : {
        type : Boolean
    },
    errorMessage: {
        type : String
    },
    lastErrorDate : {
        type : Date
    }
})

module.exports = mongoose.model('MarketingSpending',marketingSpending,'marketingSpending');

