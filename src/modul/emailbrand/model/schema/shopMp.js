const mongoose = require('mongoose');
const { Schema } = mongoose

const shopMp = new Schema({},{strict : false});

module.exports = mongoose.model('shopMp',shopMp,'shopMp');