var express 			= require('express');
var router  			= express.Router();
var con     			= require('../config/db');
var moment              = require('moment');
var nodemailer          = require('nodemailer');


// Email Template
var base_url    = 'localhost:3100/marketing'
// var base_url    = 'http://marketing.egogohub.com/'
const header_email = '<style>.btn-aktivasi:hover { text-decoration: none; background:#089a9a !important; padding: 20px 30px; border-radius: 5px; color: #fff; }</style>'+
                    '<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;border:1px solid #dcc">'+
                    '<tr><td align="left" bgcolor="#efefef" style="padding: 10px 30px 0px 30px;"><img src="http://egogohub.tech:8080/images/logo-dekkson.png" style="width: 150px; height: auto;"></td></tr>'
function footeremail(url){
    const footer_email = '<tr><td style="padding:10px 30px 10px 30px;" bgcolor="#fff" align="left"></td></tr>'+
                        '<tr><table border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="border-collapse: collapse;"></tr></table></tr>'+
                      '<tr><table border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="border-collapse: collapse;"><tr><td width="600"style="padding: 0px 20px;text-align: center; font-size: 0.9em"><span>Monday - Friday ( 08.00 WIB - 17.00 WIB )</span></td></tr></table></tr>'+
                      '<tr><table border="0" cellpadding="0" cellspacing="0" width="600" align="center" style="border-collapse: collapse;">'+
                      '<tr><td align="center" style="padding: 5px 30px 10px 30px; background-color: #ffffff; font-size: 1em; margin-top: 10px;"><span>JL. Daan Mogot, Km. 12, 8 - Jakarta Barat, DKI Jakarta 11620</span></td></tr>'+
                      '</table></tr></table>'
    return footer_email
}


const sendEmail = async function (mailto, ccto, subject, url, content) {
    const transporter   = nodemailer.createTransport({service: 'gmail',secure: false,port: 465,auth: { user: 'support@egogohub.com',pass: 'P@ssword12345'}, tls: {rejectUnauthorized: false}});
    var mailheader      = '<tr><td align="center" bgcolor="#FFFFFF" style="padding: 20px 30px 30px 30px;"><h2 style="font-size: 1.5em; margin-bottom:10px">'+subject+'</h2>'
    var mailOption      = {
        from:     'support@egogohub.com',
        to:       mailto,
        cc:       ccto,
        subject:  'Dekkson Loyalty - '+subject,
        html:     header_email+mailheader+content+footeremail(url)
    }
    return await transporter.sendMail(mailOption);
};

module.exports = {
    requestBudget : async (req,res,next) => {
        var subject         = 'Egogohub ERP | New Budgeting Request'
        var content         = '<span style="font-size: 1em; line-height: 1.8;">Hi '+req.idDirector[0].director_name+', This is an email notification that you get a budgeting request in the ERP system.. </span><br>'+
                              '<span style="font-size: 1em; line-height: 1.8;">You can see the complete information in the link below</span></td></tr>'+
                              '<tr><td align="left" bgcolor="#efefef" style="padding: 10px 30px 10px 30px;"><h1 style="text-align:center; font-size:32px">http://localho</h1></td></tr>'
        next()
        // var mailgenerator   = await sendEmail(req.idDirector[0].email, '', subject, '/budgeting/detail/'+req.lastID[0].rowid, content)
        // if(mailgenerator){
        //     transporter.close();
        //     next()
        // }else{
        //     res.json({ code:204, title:'Email gagal terkirim', message:"Email ke pengguna baru gagal terkirim.\n Sepertinya ada masalah pada koneksi anda atau server kami. Silahkan coba lagi." })
        // }
    },
}
