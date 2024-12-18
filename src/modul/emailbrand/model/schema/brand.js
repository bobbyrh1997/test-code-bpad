const mongoose = require('mongoose')
const { Schema } = mongoose

let brand = new Schema({
    brand_name : {
        type : String
    },
    description : {
        type : String
    },
    brand_image : {
        type : String
    },
    status_fulfillment : {
        type : Number
    },
    active : {
        type : String
    },
    fk_pl : {
        type : String,
    },
    email : {
        type : String
    },
    brand_code : {
        type : String
    },
    brand_user : {
        type : String
    }
})

module.exports = mongoose.model('brand',brand,'brand');

