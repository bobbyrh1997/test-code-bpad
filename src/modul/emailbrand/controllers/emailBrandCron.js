var express = require('express');
var request = require('request');
var axios = require('axios');
var https = require('https');
var moment = require('moment');
var cron = require('node-cron');
var nodemailer = require('nodemailer');

// Helper
const getPeriod = require('../../../helpers/getPeriod');
const getEmailDataSales = require('../../../helpers/getEmailDataSales');
const baseTemplate = require('../../../helpers/email/baseTemplate');
const templateYesterday = require('../../../helpers/email/templateYesterday');
const templateMonthly = require('../../../helpers/email/templateMonthly');
const templateQuarterly = require('../../../helpers/email/templateQuarter');

// Model
const emailBrand = require('../model/method/emailBrand');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 465,
    pool : true,
    auth: {
        user: 'erp@egogohub.com',
        pass: 'P@ssword12345'
    },
    tls: {
        rejectUnauthorized: false
    }
});

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'bobbyrachman97@gmail.com',
//         pass: 'wpacafafwsklufyj'
//         // pass: 'xhignnfobixqjogs'
//     }
// });

module.exports = cron.schedule('32 0 * * *', async ()=>{
    try {
        console.log("Running Send Email");
        // Setting Date Parameter
        let idrToUsd = 15217;
        let datenow = new Date();
        let datenowHtml = moment(datenow).format('DD MMM YYYY')
        let getBrandsEmail = await emailBrand.getAllBrandsEmail();

        for(let dataEmail of getBrandsEmail){
            let arrayBrands = dataEmail.brands;
            let emailBrands = dataEmail.email_pm;
            
            // Set Date Parameter for Data Sales Yesterday
            let yesterdayStart = getPeriod('yesterday',datenow).sd;
            let yesterdayEnd = getPeriod('yesterday',datenow).ed;
            let start_date = yesterdayStart;
            let cnvrt_start_date = moment(start_date).add('-1','days').format('YYYY-MM-DD');
            let end_date = yesterdayEnd;
            // Get Data Sales (Including Sales Target and Marketing Spending)
            let getDataEmailYesterday = await getEmailDataSales.DataYesterday(cnvrt_start_date,end_date,arrayBrands,emailBrands,idrToUsd);
            let getSubtotalYesterday = await getEmailDataSales.DataSubTotalYesterday(cnvrt_start_date,end_date,arrayBrands,emailBrands,idrToUsd);
            // let getSubtotalYesterday = await emailBrand.getSubTotalDataSales(cnvrt_start_date,end_date,arrayBrands);

            // Set Date Parameter for Data Sales Monthly
            let start_monthly = getPeriod('monthly',datenow).sd;
            let cnvrt_start_monthly = moment(start_monthly).add('-1','days').format('YYYY-MM-DD')
            let end_monthly = getPeriod('monthly',datenow).ed;
            // Get Data Sales Monthly (Including Sales Target and Marketing Spending)
            let getDataEmailMonthly = await getEmailDataSales.DataMonthly(cnvrt_start_monthly,end_monthly,arrayBrands,emailBrands,idrToUsd);
            let getSubTotalMonthly = await getEmailDataSales.DataSubTotalMonthly(cnvrt_start_monthly,end_monthly,arrayBrands,emailBrands,idrToUsd)
            // let getSubTotalMonthly = await emailBrand.getSubTotalDataSales(cnvrt_start_monthly,end_monthly,arrayBrands);

            // Set Date Parameter for Data Sales Quarter
            let start_quarter = getPeriod('quarterly',datenow).sd;
            let cnvrt_start_quarter = moment(start_quarter).add('-1','days').format('YYYY-MM-DD');
            let end_quarter = getPeriod('quarterly',datenow).ed;
            // Get Data Sales Quarterly (Including Sales Target and Marketing Spending)
            let getDataEmailQuarterly = await getEmailDataSales.DataQuarterly(cnvrt_start_quarter,end_quarter,arrayBrands,emailBrands,idrToUsd);
            let getSubTotalQuarterly = await getEmailDataSales.DataSubTotalQuarterly(cnvrt_start_quarter,end_quarter,arrayBrands,emailBrands,idrToUsd)
            // let getSubTotalQuarterly = await emailBrand.getSubTotalDataSales(cnvrt_start_quarter,end_quarter,arrayBrands)

            // Templating Email Yesterday
            let tpltYesterday = await templateYesterday(idrToUsd,start_date,getSubtotalYesterday,getDataEmailYesterday);
            let tpltMonthly = await templateMonthly(idrToUsd,start_monthly,end_monthly,getSubTotalMonthly,getDataEmailMonthly);
            let tpltQuarterly = await templateQuarterly(idrToUsd,start_quarter,end_quarter,getSubTotalQuarterly,getDataEmailQuarterly);

            // Combine All Template
            let emailTemplate = baseTemplate(datenowHtml,tpltYesterday,tpltMonthly,tpltQuarterly);

            let mailOptions = {
                from : 'erp@egogohub.com',
                to : emailBrands,
                subject: `Daily Sales Report of Dashboard`,
                html : emailTemplate
            };

            console.log("Send email to : ",emailBrands)
            transporter.sendMail(mailOptions,function(errMail,info){
                if(errMail){
                    console.log({
                        message : "Failed Send Email to : "+emailBrands+"",
                        detail : errMail
                    })
                } else {
                    console.log("Success send Email to : ",emailBrands)
                }
            })
        }

    } catch (error) {
        console.log(error)
    }
})
