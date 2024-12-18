const mongoose = require('mongoose');
const { Schema } = mongoose

let userSchema = new Schema({
    fullname : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    nip : {
        type : String
    },
    instansi : {
        type : String
    },
    createdAt : {
        type : Date
    }
});

module.exports = mongoose.model('users',userSchema,'users');