'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _model = require('../model');

//var User = require(__dirname + '/../model/user');

var jwt = require('jsonwebtoken');
var crypto = require('crypto');
var config = require('../common/config');

function checkManagerAdmin(req, res, next) {
    var id;
    return _regeneratorRuntime.async(function checkManagerAdmin$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                id = req.decoded._id || req.body.id || req.query.id;

                console.log(req.decoded);

                if (!(req.decoded.userType == "admin")) {
                    context$1$0.next = 6;
                    break;
                }

                next();
                context$1$0.next = 7;
                break;

            case 6:
                return context$1$0.abrupt('return', res.status(200).send({
                    status: 401,
                    message: 'You have no admin access.'
                }));

            case 7:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function checkAuthenticated(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-auth-token']; // || req.headers['X-Auth-Token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {

                console.log(err);
                return res.status(200).send({
                    status: 401,
                    message: 'Token is not valid.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {

        // if there is no token
        // return an error
        return res.status(200).send({
            status: 400,
            message: 'Token is not provided.'
        });
    }
}

function checkSignatureNotExpired(req, res, next) {

    return next();
}

module.exports = {
    checkManagerAdmin: checkManagerAdmin,
    checkAuthenticated: checkAuthenticated,
    checkSignatureNotExpired: checkSignatureNotExpired
};