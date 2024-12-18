let moment = require('moment')

module.exports = function(datenow,templateYesterday,templateMonthly,templateQuarter){
    let baseTemplate = `
    <div><p style="color: #222222; font-family: calibri;">Dear All, <br><br> There are Daily Reports of Dashboard ${datenow}.</p></div>
    ${templateYesterday}
    ${templateMonthly}
    ${templateQuarter}`

    return baseTemplate 
}