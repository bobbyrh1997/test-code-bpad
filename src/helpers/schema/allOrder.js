const mongoose = require('mongoose')
const { Schema } = mongoose

let AllOrder = new Schema({
    store_id : {
        type : String
    },
    marketplace : {
        type : String
    },
    store_name : {
        type : String
    },
    order_id : {
        type : String
    },
    invoice_no : {
        type : String,
        default : null
    },
    payment_date : {
        type : Date
    },
    shipper_mp : {
        type : String
    },
    shipper_internal : {
        type : String
    },
    tracking_no : {
        type : String,
        default : ''
    },
    customer_name : {
        type : String
    },
    recipient_name : {
        type : String
    },
    customer_phone : {
        type : String
    },
    recipient_phone : {
        type : String
    },
    shipping_address : {
        type : String
    },
    shipping_post_code : {
        type : String
    },
    shipping_province : {
        type : String
    },
    shipping_city : {
        type : String
    },
    shipping_area : {
        type : String
    },
    shipping_country : {
        type : String
    },
    cancel_reason : {
        type : String
    },
    cancel_reason_detail : {
        type : String
    },
    marketplace_status : {
        type : String
    },
    internal_status : {
        type : String
    },
    sub_total : {
        type : Number
    },
    insurance_cost : {
        type : Number
    },
    shipping_cost : {
        type : Number
    },
    delivery_date : {
        type : Date,
        default : null
    },
    completion_date : {
        type : Date,
        default : null
    },
    grand_total : {
        type : Number
    },
    customer_email : {
        type : String
    },
    payment_method : {
        type : String
    },
    products : [
        {
            order_id : {
                type : String
            },
            marketplaceId : {
                type : String
            },
            shopId : {
                type : String
            },
            note : {
                type : String
            },
            item_code : {
                type : String
            },
            item_sku : {
                type : String
            },
            item_name : {
                type : String
            },
            srp : {
                type : Number
            },
            price : {
                type : Number
            },
            qty : {
                type : Number
            },
            total : {
                type : Number
            }
        }
    ],
    validasi1status: {
        type : Boolean,
        default : false
    },
    create_date : {
        type : Date
    },
    status_fulfillment : {
        type : Number,
        default : 1
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : Date
    }
})

AllOrder.index({
    order_id : 1,
    invoice_no : 1
},{
    unique : true
})

module.exports = mongoose.model('AllOrder',AllOrder,'allOrders');

