const mongoose = require('mongoose');
const { Schema } = mongoose;

const instansiSchema = new Schema({},{strict : false});

module.exports = mongoose.model('instansi',instansiSchema,'instansi');