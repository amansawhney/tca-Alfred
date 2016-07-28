
var jwt    = require('jsonwebtoken');
var crypto = require('crypto');
var config = require('../common/config');

import { User } from '../model';
//var User = require(__dirname + '/../model/user');


async function checkManagerAdmin(req, res, next){
    var id = req.decoded._id || req.body.id || req.query.id;
    if (req.decoded.username == config.admin_username)
    {
        next();
    }
    else {
        return res.status(200).send({
            status: 401,
            message: 'You have no admin access.'
        });

    }

}

function checkAuthenticated(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-auth-token'];// || req.headers['X-Auth-Token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function(err, decoded) {
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

function checkSignatureNotExpired(req, res, next){

    return next();

}

module.exports = {
    checkManagerAdmin: checkManagerAdmin,
    checkAuthenticated: checkAuthenticated,
    checkSignatureNotExpired: checkSignatureNotExpired
}