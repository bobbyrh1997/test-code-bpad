var express 		= require('express');
var router 			= express.Router();
var con 				= require('../../../config/db');
var multipart 			= require('connect-multiparty');
var multipartMiddleware = multipart();
var fs 					= require('fs');
var mv 					= require('mv');
const Cryptr        	= require('cryptr');
const cryptr        	= new Cryptr('myTotalySecretKey');
var request             = require("request");

module.exports = {
	getUser: function (req, res, next) {
	
        var options =   { 
            method: 'GET',
            url: 	'https://erp.egogohub.com/cron/apidashboard.php?s=getUsers',
        };
        request(options, async (error, response, body) => {
            // console.log(error)
            console.log(body)
            var result = JSON.parse(body)
            // console.log(result);
            // let data = result
            next()
        });
		
	},
}
