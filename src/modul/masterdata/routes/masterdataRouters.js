var express = require('express');
var MasterDataRouter = express.Router();

const masterdataControllers = require('../controllers/masterdataControllers.js');

MasterDataRouter.get('/user/list',masterdataControllers.listUserPage)
MasterDataRouter.get('/user/add',masterdataControllers.addUserPage)
MasterDataRouter.post('/user/add-data',masterdataControllers.addUserData)

MasterDataRouter.get('/instansi/list',masterdataControllers.listInstansiPage)
MasterDataRouter.get('/instansi/add',masterdataControllers.addInstansiPage)
MasterDataRouter.post('/instansi/add-data',masterdataControllers.addInsansiData)

MasterDataRouter.get('/vehicle/list',masterdataControllers.listVehiclePage)

module.exports = MasterDataRouter