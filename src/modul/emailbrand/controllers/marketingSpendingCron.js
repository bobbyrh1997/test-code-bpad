var express = require('express');
var request = require('request');
var axios = require('axios');
var https = require('https');
var moment = require('moment');
var cron = require('node-cron');
var nodemailer = require('nodemailer');

// Helper
const getPeriod = require('../../../helpers/getPeriod');
const marketingSpending = require('../model/schema/marketingSpending');

// Model
const emailBrand = require('../model/method/emailBrand');
const brand = require('../model/schema/brand');
const getMarketingSpending = require('../../../helpers/getMarketingSpending');

module.exports = cron.schedule('0 */4 * * *', async ()=>{
    try {
        console.log("Running Cron Marketing Spending");
        let datenow = new Date();
        let yesterday = getPeriod('yesterday',datenow).ed;
        let startMonthDate = getPeriod('monthly',datenow).sd;
        let startQuarterDate = getPeriod('quarterly',datenow).sd

        let AllBrand = await brand.find({"active" : "1"});
        for(let brand of AllBrand){
            let brand_name = brand.brand_name;
            let brand_id = brand._id;
            let brand_code = brand.brand_code;

            try {
                let resultMonthMarketingSpending = await getMarketingSpending(startMonthDate,yesterday);
                let resultQuarterMarketingSpending = await getMarketingSpending(startQuarterDate,yesterday);

                let dataMonthlyMarketingSpending = resultMonthMarketingSpending.data;
                let dataQuarterlyMarketingSpending = resultQuarterMarketingSpending.data;

                let brandMktSpendingMonthly = dataMonthlyMarketingSpending.find(mkSpending => mkSpending.brandCde === brand_code);
                let brandMktSpendingQuarterly = dataQuarterlyMarketingSpending.find(mkSpending => mkSpending.brandCde === brand_code)

                let amount_monthly = brandMktSpendingMonthly == undefined ? 0 : brandMktSpendingMonthly.amount;
                let amount_quarterly = brandMktSpendingQuarterly == undefined ? 0 : brandMktSpendingQuarterly.amount;
                let currency = brandMktSpendingMonthly == undefined ? "IDR" : brandMktSpendingMonthly.currency;
                let platform = brandMktSpendingMonthly == undefined ? null : brandMktSpendingMonthly.platform;

                let checkData = await marketingSpending.findOne({"brand_code" : brand_code});
                if(checkData){
                    let dataUpdate = {
                        amount_monthly,
                        amount_quarterly,
                        currency,
                        platform,
                        updateAt : new Date(),
                        errorStatus : false,
                        errorMessage : null,
                    }

                    await marketingSpending.findOneAndUpdate({"brand_code" : brand_code},dataUpdate)
                } else {
                    let dataInsert = {
                        brand_id,
                        brand_name,
                        brand_code,
                        amount_monthly,
                        amount_quarterly,
                        currency,
                        platform,
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        errorStatus : false
                    }

                    await marketingSpending.create(dataInsert)
                }
            } catch (error) {
                let checkMarketingSpending = await marketingSpending.findOne({"brand_code" : brand_code});
                if(checkMarketingSpending){
                    let dataError = {
                        errorStatus : true,
                        errorMessage : error.message,
                        lastErrorDate : new Date()
                    }
                    await marketingSpending.findOneAndUpdate({"brand_code" : brand_code},dataError)
                } else {
                    let dataError = {
                        brand_id,
                        brand_code,
                        brand_name,
                        errorStatus : true,
                        errorMessage : error.message,
                        lastErrorDate : new Date()
                    }
                    await marketingSpending.create(dataError)
                }
            }
        }

        console.log("Marketing Spending Cron End")

    } catch (error) {
        console.log(error)
    }
})
