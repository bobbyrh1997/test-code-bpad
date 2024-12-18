var express = require('express');
var request = require('request');
var axios = require('axios');
var https = require('https');
var moment = require('moment');
var cron = require('node-cron');
var nodemailer = require('nodemailer');

// Helper
const getPeriod = require('../../../helpers/getPeriod');
const getSalesTarget = require('../../../helpers/getSalesTarget');

// Model
const emailBrand = require('../model/method/emailBrand');
const salesTarget = require('../model/schema/salesTarget');
const brand = require('../model/schema/brand');

module.exports = cron.schedule('0 */4 * * *', async ()=>{
    try {
        console.log("Running Cron Sales Target")
        let datenow = new Date();
        let yesterday = getPeriod('yesterday',datenow).ed;
        let AllBrand = await brand.find({"active" : "1"});
        for(let brand of AllBrand){
            let brand_name = brand.brand_name;
            let brand_id = brand._id;
            let brand_code = brand.brand_code;
            try {
                let getSalesTargetMonthly = JSON.parse(await getSalesTarget('monthly',yesterday));
                let dataMonthlySalesTarget = getSalesTargetMonthly.data
                let brandSalesTargetMonthly = dataMonthlySalesTarget.find(slsTarget => slsTarget.brandCde === brand_code);
    
                let daily_target = brandSalesTargetMonthly == undefined ? 0 : brandSalesTargetMonthly.dailyTarget;
                let monthly_target = brandSalesTargetMonthly == undefined ? 0 : brandSalesTargetMonthly.target
    
                let getSalesTargetQuarterly = JSON.parse(await getSalesTarget('quarterly',yesterday));
                let dataQuarterlySalesTarget = getSalesTargetQuarterly.data;
                let brandSalesTargetQuarterly = dataQuarterlySalesTarget.find(slsTarget => slsTarget.brandCde === brand_code);
    
                let quarter_target = brandSalesTargetQuarterly == undefined ? 0 : brandSalesTargetQuarterly.target;
    
                let checkSalesTarget = await salesTarget.findOne({"brand_code" : brand_code});
    
                if(checkSalesTarget){
                    let dataSalesTarget = {
                        brand_id,
                        brand_code,
                        brand_name,
                        daily_target,
                        monthly_target,
                        quarter_target,
                        updatedAt : new Date(),
                        errorStatus : false,
                        errorMessage : null,
                    }
                    await salesTarget.findOneAndUpdate({"brand_code" : brand_code},dataSalesTarget)
                } else {
                    let dataSalesTarget = {
                        brand_id,
                        brand_code,
                        brand_name,
                        daily_target,
                        monthly_target,
                        quarter_target,
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        errorStatus : false,
                        errorMessage : null,
                    }
                    await salesTarget.create(dataSalesTarget)
                }   
            } catch (error) {
                let checkSalesTarget = await salesTarget.findOne({"brand_code" : brand_code});
                if(checkSalesTarget){
                    let dataError = {
                        brand_id,
                        brand_code,
                        brand_name,
                        errorStatus : true,
                        errorMessage : error.message,
                        lastErrorDate : new Date()
                    }
                    await salesTarget.findOneAndUpdate({"brand_code" : brand_code},dataError)
                } else {
                    let dataError = {
                        brand_id,
                        brand_code,
                        brand_name,
                        errorStatus : true,
                        errorMessage : error.message,
                        lastErrorDate : new Date()
                    }
                    await salesTarget.create(dataError)
                }
            }
        }
        console.log("Cron Sales Target Done")
    } catch (error) {
        console.log(error)
    }
})
