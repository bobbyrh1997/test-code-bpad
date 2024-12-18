var express             = require('express');
var authRouter     = express.Router();
const dataMaster        = require('../../../helpers/dataMaster');

const authController   = require('../controllers/AuthController')

// Login Router
authRouter.get('/', dataMaster.myID, authController.index);
authRouter.post('/login/verify',authController.VerifyLogin);
authRouter.get('/register',authController.registerPage);
authRouter.post('/register-user',authController.registerUser);

module.exports = authRouter