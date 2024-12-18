const mongoose = require('mongoose');
const { Schema } = mongoose;

const vehicleSchema = new Schema({},{strict : false});

module.exports = mongoose.model('vehicles',vehicleSchema,'vehicles');