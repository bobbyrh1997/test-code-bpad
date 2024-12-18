let moment = require('moment');

module.exports = function(categoryDate,currentDate){
    let sd;
    let ed;
    if(categoryDate == 'yesterday'){
        let yesterday = moment(currentDate).add('-1','days').format('YYYY-MM-DD');
        sd = yesterday
        ed = yesterday
    } else if(categoryDate == 'monthly'){
        let yesterday = moment(currentDate).add('-1','days').format('YYYY-MM-DD');
        let firstMonth = moment(yesterday).startOf('month').format('YYYY-MM-DD');
        sd = firstMonth
        ed = yesterday
    } else if(categoryDate == 'quarterly'){
        let yesterday = moment(currentDate).add('-1','days').format('YYYY-MM-DD');
        let firstQuarter = moment(yesterday).quarter(moment(yesterday).quarter()).startOf('quarter').format('YYYY-MM-DD');
        sd = firstQuarter
        ed = yesterday
    } else if(categoryDate == 'yearly'){
        let yesterday = moment(currentDate).add('-1','days').format('YYYY-MM-DD');
        let firstYear = moment(yesterday).startOf('year').format('YYYY-MM-DD');
        sd = firstYear
        ed = yesterday
    } else if(categoryDate == 'quarter'){
        let yesterday = moment(currentDate).add('-1','days').format('YYYY-MM-DD');
        let firstQuarter = moment(yesterday).subtract(2, 'months').startOf('month').format('YYYY-MM-DD');
        sd = firstQuarter
        ed = yesterday
    }

    let startDate = sd + ' 00:00:00';
    let endDate = ed + ' 23:59:59';

    let IsoStartDate = new Date(startDate);
    let IsoEndDate = new Date(endDate);

    return {
        sd,
        ed,
        localStartDate : startDate,
        localEndDate : endDate,
        IsoStartDate,
        IsoEndDate
    }
}