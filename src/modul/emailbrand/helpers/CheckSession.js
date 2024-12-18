var express 			= require('express');
var router  			= express.Router();
var multipart           = require('connect-multiparty');
var request				= require('request');
const { json } = require('express');



module.exports = function(req,res,next){
    if(req.session.myID){
        next()
    } else {
        res.redirect('/')
    }
}
