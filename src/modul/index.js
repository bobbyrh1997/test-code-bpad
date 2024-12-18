let Router              = require('express').Router()
let authRouter          = require('./auth/routes/AuthRoutes')
let emailBrandRouter    = require('./emailbrand/routes/EmailBrandRoutes');
let dashboardRouter = require("./dashboard/routes/dashboardRoutes")
let masterdataRouter = require("./masterdata/routes/masterdataRouters");

Router.use('/', authRouter)
Router.use('/email-brand',emailBrandRouter)
Router.use('/',dashboardRouter)
Router.use('/masterdata',masterdataRouter)


module.exports = Router