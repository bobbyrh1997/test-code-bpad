const { query }         = require("express");
var con     			= require('../config/db');

const privateData = {
    _customerValidation: async (email) => await isExist('users', 'email', email),
}

module.exports = {
    checkCustomer: async (req, res, next) => {
        const isExist = await privateData._customerValidation(req.body.email)
        if (isExist) {
            next()
        } else {
            res.status(200).send(
                skeleton(false, req.body, 'Account is not registered', 'Email is not registered')
            )
        }
    },
}
