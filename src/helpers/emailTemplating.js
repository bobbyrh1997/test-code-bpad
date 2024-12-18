// Import Helper
const getMarketingSpending = require("./getMarketingSpending");
const { getDataSales, getSubTotalDataSales } = require("../modul/emailbrand/model/method/emailBrand");
const getSalesTarget = require("./getSalesTarget");
const getPeriod = require("./getPeriod");

module.exports = async(dataEmail)=>{
    let idrToUsd = 14500;
    let datenow = new Date();
    let yesterday = getPeriod('yesterday',datenow).ed;
    let brands = dataEmail.brands;
    let email_pm = dataEmail.email_pm;

    // Get Sales Target
    let getMonthSalesTarget = await getSalesTarget('monthly',yesterday);
    let getQuarterSalesTarget = await getSalesTarget('quarterly',yesterday);             
    let resultMonthSalesTarget = JSON.parse(getMonthSalesTarget);
    let resultQuarterSalesTarget = JSON.parse(getQuarterSalesTarget);

    // Get Marketing Spending
    let startMonthDate = getPeriod('monthly',datenow).sd;
    let startQuarterDate = getPeriod('quarterly',datenow).sd;
    let resultMonthMarketingSpending = await getMarketingSpending(startMonthDate,yesterday);
    let resultQuarterMarketingSpending = await getMarketingSpending(startQuarterDate,yesterday);

    // Get Data Sales Yesterday
    let start_date = yesterday;
    let end_date = yesterday
    let resultYesterday = await getDataSales(start_date,end_date,brands);
    let resultSubYesterday =await getSubTotalDataSales(start_date,end_date,brands);

    // Get Data Sales Month to Date
    let date_start = getPeriod('monthly',datenow).sd;
    let date_end = getPeriod('monthly',datenow).ed;
    let resultMonth = await getDataSales(date_start,date_end,brands);
    let resultSubMonth = await getSubTotalDataSales(date_start,date_end,brands);

    // Get Data Sales Quarter to Date
    let start_quarter = getPeriod('quarterly',datenow).sd;
    let end_quarter = getPeriod('quarterly',datenow).ed;
    let resultQuarter = await getDataSales(start_quarter,end_quarter,brands);
    let resultSubQuarter = await getSubTotalDataSales(start_quarter,end_quarter,brands);

    console.log(resultYesterday)
}