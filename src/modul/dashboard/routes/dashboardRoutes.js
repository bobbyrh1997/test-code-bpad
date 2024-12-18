var express             = require('express');
var dashboardRouter     = express.Router();
const dashboardController   = require('../controllers/dashboardControllers')

// Login Router
dashboardRouter.get('/home', dashboardController.dashboardPage);

module.exports = dashboardRouter