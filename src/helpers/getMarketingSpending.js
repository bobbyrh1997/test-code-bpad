let moment = require('moment');
const sendRequest = require('./sendRequest');


module.exports = async(dateStart,dateEnd)=>{
    let getMarketingSpending = await sendRequest({
        method  : 'POST',
        url     : `https://intranet.avconcept.com/api/erp-marketing/adv/selectMarketingSpending`,
        headers : {
            'Content-Type': 'application/json'
        },
        body    : JSON.stringify({
            "region": 'ID',
            "currency": 'IDR',
            "effDate": dateStart,
            "endDate": dateEnd
        })
    });
    let getResult = JSON.parse(getMarketingSpending);
    return getResult;
}