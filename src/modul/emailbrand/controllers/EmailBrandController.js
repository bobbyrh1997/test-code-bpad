var express                 = require('express');
var router                  = express.Router();
var multipart               = require('connect-multiparty');
var multipartMiddleware     = multipart();
var fs                      = require('fs');
var mv                      = require('mv');
var request                 = require("request");
let moment                  = require('moment');

// Schema & Model
const allOrder = require('../../../helpers/schema/allOrder');
const EmailBrandModel = require('../model/method/emailBrandModel');
const brandCategory = require('../model/schema/brandCategory');
const emailBrand = require('../model/method/emailBrand')

// Helpers
const sendRequest = require('../../../helpers/sendRequest');


module.exports = {
    pageEmailBrand: async function(req, res, next) {
        let getUser = await sendRequest({ 
            method: 'GET',
            url: 	'https://erp.egogohub.com/cron/apidashboard.php?s=getUsers',
        });
        let resultUser = JSON.parse(getUser);
        let Brand = await emailBrand.getBrand();
        let dataRows = await emailBrand.getEmailBrand();
        res.render('email_brand/emailBrand',{ title: 'Egogohub | Email Brand', dataUser: resultUser, dataBrand: Brand, data: dataRows,MyManagement: req.session.MyManagement})
    },
    saveEmailBrand: async function (req, res, next){
        if (typeof(req.body.name) == 'object') {
            for (let i = 0; i < req.body.name.length; i++) {
                var dataEmailBrandCategory2 = {
                    brand_id: req.body.brand[i],
                    user_id: req.body.user[i],
                    name_pm: req.body.name[i].trim(),
                    email_pm: req.body.email[i].trim(),
                    status: req.body.status[i],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }

                let insertEmail = await emailBrand.insertEmailBrand(dataEmailBrandCategory2)
                if(insertEmail){
                    if(i+1 == req.body.name.length){
                        res.json({status: 200, message: `Success created`})
                    }
                }
            }
        } else {
            var dataEmailBrandCategory2 = {
                brand_id: req.body.brand,
                user_id: req.body.user,
                name_pm: req.body.name.trim(),
                email_pm: req.body.email.trim(),
                status: req.body.status,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            let insertEmail = await emailBrand.insertEmailBrand(dataEmailBrandCategory2)
            if(insertEmail){
                res.json({ status: 200, message: `Success created` })
            }
        }
    },
    detail : async function (req, res, next){
        try {
            let getUser = await sendRequest({ 
                method: 'GET',
                url: 	'https://erp.egogohub.com/cron/apidashboard.php?s=getUsers',
            });
            let resultUser = JSON.parse(getUser);
            let Brand = await emailBrand.getBrand();
            let getEmailData = await emailBrand.getEmailBrandById(req.params.rowid);
            res.render('email_brand/emailBrandDetail', { 
                title: 'Egogohub | Detail Email Brand', 
                dataUser: resultUser, 
                dataBrand: Brand, 
                data: getEmailData, 
                MyManagement: req.session.MyManagement
            })
        } catch (error) {
            console.log(error)
        }
        
        
    },
    update : async function (req, res, next){
        try {
            let rowid = req.body.rowid.trim()
            let dataUpdate = {
                brand_id: req.body.brand,
                user_id: req.body.user,
                name_pm: req.body.name,
                email_pm: req.body.email.trim(),
                status: req.body.status,
                updatedAt: new Date()
            }
            let updateEmailBrand = await emailBrand.updateEmailBrand(rowid,dataUpdate);
            if(updateEmailBrand){
                res.json({
                    status: 200,
                    message: `Success updated`,
                })
            }
        } catch (error) {
            res.json({
                code:400,
                message : error.message
            })
        }
        
    },
    reportSales : (req, res, next) =>{
        console.log('==Report sales==');
        res.render('email_brand/template', {
            title: 'Egogohub | Template Sales',
            MyManagement: req.session.MyManagement
        })
    },
    delete: async function (req, res, next) {
        try {
            let data = req.body.rowid
            let arrayRowid = data.split(' ')
            for (let i = 0; i < arrayRowid.length; i++) {
                let deleteEmailBrand = await emailBrand.deleteEmailBrand(arrayRowid[i]);
                if(deleteEmailBrand){
                    if(i+1 == arrayRowid.length){
                        console.log('==DONE ALL DELETE DATA==')
                        res.json({
                            code: 200,
                            message: 'Data delete success'
                        })
                    }
                }
            }   
        } catch (error) {
            res.json({
                code:400,
                message : error.message
            })
        }
	},
}
