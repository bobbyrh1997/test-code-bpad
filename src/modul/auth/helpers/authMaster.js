const { query }         = require("express");
var con     			= require('../../../config/db');
const Cryptr            = require('cryptr');
const cryptr            = new Cryptr('myTotalySecretKey');
var request             = require("request");

module.exports = {
    myID: async (req,res,next) => {
        // req.session.myID = 30;
        // next()
        if(req.session.myID){
            next()
        } else {
            res.redirect('/')
        }
    },
}