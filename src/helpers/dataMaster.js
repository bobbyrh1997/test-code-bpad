const { query }         = require("express");
var con     			= require('../config/db');
const Cryptr            = require('cryptr');
const cryptr            = new Cryptr('myTotalySecretKey');
var request             = require("request");

module.exports = {
    myID: async (req,res,next) => {
        req.session.myID = 30 /// 30 adalah id ERP Fatih
        next()
    },
    getRef: async (req,res,next) => {
        var options =   { 
            method: 'GET',
            url: 'https://erp.egogohub.com/cron/apiAdsCampaign.php?s=getNewRef',
        };
        request(options, async (error, response, body) => {
            if (error){
                res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
            }else{
                var result = JSON.parse(body)
                if(body){
                    req.budgetingRef  = result.response[0].ref
                    next()
                }else{
                    if(req.body.length > 0){
                        res.json({code:205, title:'Request failed to save', message:'Failed to generate Request Number. \nPlease try again'})
                    }else{
                        res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to generate Request Number. Please try again', error:error});
                    }
                }
            }
        });
    },
    getAllBrand: async (req,res,next) => {
        var options =   { 
            method: 'GET',
            url: 'https://erp.egogohub.com/cron/apiAdsCampaign.php?s=getAllBrand',
        };
        request(options, async (error, response, body) => {
            if (error){
                res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
            }else{
                var result = JSON.parse(body)
                if(body){
                    req.dataBrand  = result.response
                    next()
                }else{
                    res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
                }
            }
        });
    },
    getAllPurpose: async (req,res,next) => {
        var options =   { 
            method: 'GET',
            url: 'https://erp.egogohub.com/cron/apiAdsCampaign.php?s=getAllPurpose',
        };
        request(options, async (error, response, body) => {
            if (error){
                res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
            }else{
                var result = JSON.parse(body)
                if(body){
                    req.dataPurpose  = result.response
                    next()
                }else{
                    res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
                }
            }
        });
    },
    getCampaign: async (req,res,next) => {
        var options =   { 
            method: 'GET',
            url: 'https://erp.egogohub.com/cron/apiAdsCampaign.php?s=getListBudgeting',
        };
        request(options, async (error, response, body) => {
            if (error){
                res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
            }else{
                var result = JSON.parse(body)
                if(body){
                    req.dataCampaign  = result.response
                    next()
                }else{
                    res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
                }
            }
        });
    },
    getDirector: async (req,res,next) => {
        var options =   { 
            method: 'GET',
            url: 'https://erp.egogohub.com/cron/apiAdsCampaign.php?s=getDirector',
        };
        request(options, async (error, response, body) => {
            if (error){
                res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
            }else{
                var result = JSON.parse(body)
                if(body){
                    req.idDirector  = result.response
                    next()
                }else{
                    res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
                }
            }
        });
    },
    getLastID: async (req,res,next) => {
        var options =   { 
            method: 'GET',
            url: 'https://erp.egogohub.com/cron/apiAdsCampaign.php?s=getLastID&id='+req.session.myID,
        };
        request(options, async (error, response, body) => {
            if (error){
                res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
            }else{
                var result = JSON.parse(body)
                if(body){
                    req.lastID  = result.response
                    next()
                }else{
                    res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
                }
            }
        });
    },
    getCreator: async (req,res,next) => {
        var rowid   = 30
        var options =   { 
            method: 'GET',
            url: 'https://erp.egogohub.com/cron/apiAdsCampaign.php?s=getLastID&id='+rowid,
        };
        request(options, async (error, response, body) => {
            if (error){
                res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
            }else{
                var result = JSON.parse(body)
                if(body){
                    req.dataCreator  = result.response
                    next()
                }else{
                    res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
                }
            }
        });
    },
    getRequestDetail: async (req,res,next) => {
        var options =   { 
            method: 'GET',
            url: 'https://erp.egogohub.com/cron/apiAdsCampaign.php?s=getAdsCampaignDetail&id='+req.params.id,
        };
        request(options, async (error, response, body) => {
            if (error){
                res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
            }else{
                var result = JSON.parse(body)
                if(body){
                    req.dataDetail  = result.response
                    next()
                }else{
                    res.render("error.ejs", { title: "Egogo Hub Indonesia | Error Page", message: 'Failed to get data. Please try again', error:error});
                }
            }
        });
    },
} 