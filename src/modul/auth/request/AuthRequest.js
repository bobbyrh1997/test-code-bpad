var express 			= require('express');
var router 				= express.Router();
var con 				= require('../../../config/db');
var multipart 			= require('connect-multiparty');
var multipartMiddleware = multipart();
var fs 					= require('fs');
var mv 					= require('mv');
const Cryptr        	= require('cryptr');
const cryptr        	= new Cryptr('myTotalySecretKey');
const AuthModel 	= require('../model/AuthModel')
var request             = require("request");

module.exports = {
	
}
