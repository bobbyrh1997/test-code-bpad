const mongoose = require('mongoose')
const { Schema } = mongoose

let salesTarget = new Schema({
    brand_id : {
        type : mongoose.Schema.Types.ObjectId
    },
    brand_code : {
        type : String
    },
    brand_name : {
        type : String
    },
    daily_target : {
        type : Number
    },
    monthly_target : {
        type : Number
    },
    quarter_target : {
        type : Number
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

module.exports = mongoose.model('SalesTarget',salesTarget,'salesTarget');

