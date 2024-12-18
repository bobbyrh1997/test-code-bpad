var express = require('express');
var EmailBrandRouter = express.Router();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


const EmailBrandController = require('../controllers/EmailBrandController');
const CheckSession = require('../helpers/CheckSession');
const getUser = require ('../request/dataUser.js')


EmailBrandRouter.get('/email-brand',CheckSession, EmailBrandController.pageEmailBrand)
EmailBrandRouter.get('/email-brand/detail/(:rowid)',CheckSession, EmailBrandController.detail)
EmailBrandRouter.post('/save', EmailBrandController.saveEmailBrand)
EmailBrandRouter.post('/update', EmailBrandController.update)
EmailBrandRouter.post('/delete', EmailBrandController.delete)

EmailBrandRouter.get('/report/sales',CheckSession, EmailBrandController.reportSales)


module.exports = EmailBrandRouter