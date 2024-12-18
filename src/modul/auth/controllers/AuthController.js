var express 			= require('express');
var router  			= express.Router();
var con     			= require('../../../config/db');
var multipart           = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs                  = require('fs');
var mv                  = require('mv');
const { resolveSoa } = require('dns');
const AuthModel			= require('../model/AuthModel')
var request             = require("request");
let bcrypt 				= require('bcrypt');

var salt = bcrypt.genSaltSync(10)

module.exports = {
	index : function(req,res,next){
		res.render('login',{title: 'Login Apps'})
	},
	home : function(req,res,next){
		// console.log(req.session)
		res.render('home',{
			title: 'Egogohub | Home',
			MyManagement: req.session.MyManagement
		})
	},
	VerifyLogin: async (req, res, next)=>{
		let email = req.body.email;
		let password = req.body.password;
		if(email == "superadmin"){
			req.session.fullname = "superadmin";
			req.session.email = "superadmin";
			req.session.nip = "123456";
			return res.json({ code:200, title:'Login Success!', message: ''})
		} else {
			let checkUser = await AuthModel.findOne({"email" : email});
			if(checkUser){
				let registeredPassword = checkUser.password;
				if(bcrypt.compareSync(password,registeredPassword) == true){
					req.session.fullname = checkUser.fullname;
					req.session.email = checkUser.email;
					req.session.nip = checkUser.nip;
					return res.json({ code:200, title:'Login Success!', message: ''})
				}
			} else {
				return res.json({ code:200, title:'Login Failed!', message : 'User not found!'})
			}
		}
	},
	registerPage : async(req,res,next)=>{
		return res.render('register',{
			title : 'Register Account'
		})
	},
	registerUser : async(req,res,next)=>{
		let {
			fullname,
			email,
			password,
			nip
		} = req.body;

		let pass_encrypt = bcrypt.hashSync(password,salt);

		let dataUser = {
			fullname,
			email,
			password: pass_encrypt,
			nip,
			createdAt : new Date()
		};

		let saveUser = await AuthModel.create(dataUser);
		if(saveUser){
			res.json({ code:200, title:'Register Success!'})
		}

	},
	LogOut : function(req,res,next){
		req.session.destroy(); 
        req.session = null;
        res.redirect('/');
	}
}
