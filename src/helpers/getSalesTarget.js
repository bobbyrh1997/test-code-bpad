let moment = require('moment');
const sendRequest = require('./sendRequest');
var https = require('https')


module.exports = async(categoryPeriod,yesterday)=>{
    let baseUrl = 'https://intranet.avconcept.com/api/system/sales'
    let yesterdayYear = moment(yesterday).format('YYYY') 
    let yesterdayMonth = moment(yesterday).format('MM')
    let yesterdayQuarter = moment(yesterday).quarter();
    let egogoQuarter = yesterdayQuarter == 1 ? 4 : yesterdayQuarter-1

    let endpoint
    if(categoryPeriod == 'monthly'){
        endpoint = '/selectMonthSalesTarget?region=ID&currencyCode=IDR&year='+yesterdayYear+'&month='+yesterdayMonth+''
    } else if(categoryPeriod == 'quarterly'){
        endpoint = '/selectQuarterSalesTarget?region=ID&currencyCode=IDR&year='+yesterdayYear+'&quarter='+egogoQuarter+''
    } else if(categoryPeriod == 'yearly'){
        endpoint = '/selectYearSalesTarget?region=ID&currencyCode=IDR&year='+yesterdayYear+''
    }

    let fullUrl = baseUrl + endpoint;
    let getSalesTarget = await sendRequest({
        method  : 'GET',
        url     : fullUrl,
    });
    return getSalesTarget;
}