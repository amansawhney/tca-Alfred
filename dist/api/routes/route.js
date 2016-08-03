'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _controllerToken = require('../controller/token');

var _controllerToken2 = _interopRequireDefault(_controllerToken);

var _controllerUser = require('../controller/user');

var _controllerUser2 = _interopRequireDefault(_controllerUser);

var _controllerRecord = require('../controller/record');

var _controllerRecord2 = _interopRequireDefault(_controllerRecord);

module.exports = function (app) {
    var express = require('express');
    var router = express.Router();

    router.post('/user/signup', _controllerToken2['default'].checkSignatureNotExpired, _controllerUser2['default'].signUp);
    router.post('/user/login', _controllerToken2['default'].checkSignatureNotExpired, _controllerUser2['default'].logIn);
    router.post('/admin/login', _controllerToken2['default'].checkSignatureNotExpired, _controllerUser2['default'].loginAdmin);
    router.post('/user/forgotpassword', _controllerToken2['default'].checkSignatureNotExpired, _controllerUser2['default'].forgotPassword);
    router.get('/resetpassword/:token', _controllerUser2['default'].showResetPage);
    router.post('/resetpassword/:token', _controllerUser2['default'].resetPassword);

    // Profile API
    router.put('/me/changepassword', _controllerToken2['default'].checkSignatureNotExpired, _controllerToken2['default'].checkAuthenticated, _controllerUser2['default'].changePassword);
    router.put('/me/updateprofile', _controllerToken2['default'].checkSignatureNotExpired, _controllerToken2['default'].checkAuthenticated, _controllerUser2['default'].updateProfile);
    router.get('/me/info', _controllerToken2['default'].checkSignatureNotExpired, _controllerToken2['default'].checkAuthenticated, _controllerUser2['default'].getMeInfo); //,

    // User Management APIs
    router.post('/user', _controllerToken2['default'].checkSignatureNotExpired, _controllerToken2['default'].checkAuthenticated, _controllerToken2['default'].checkManagerAdmin, _controllerUser2['default'].signUp);
    //router.get('/users', token.checkSignatureNotExpired, token.checkAuthenticated, token.checkManagerAdmin, user.users);
    router.get('/user/:id', _controllerToken2['default'].checkSignatureNotExpired, _controllerToken2['default'].checkAuthenticated, _controllerToken2['default'].checkManagerAdmin, _controllerUser2['default'].getUser);
    router['delete']('/user/:id', _controllerToken2['default'].checkSignatureNotExpired, _controllerToken2['default'].checkAuthenticated, _controllerToken2['default'].checkManagerAdmin, _controllerUser2['default'].deleteUser);
    router.put('/user/:id', _controllerToken2['default'].checkSignatureNotExpired, _controllerToken2['default'].checkAuthenticated, _controllerToken2['default'].checkManagerAdmin, _controllerUser2['default'].updateUser);

    //Record Management
    router.get('/me/records', _controllerToken2['default'].checkSignatureNotExpired, _controllerToken2['default'].checkAuthenticated, _controllerRecord2['default'].getMyRecords);
    router.get('/admin/records', _controllerToken2['default'].checkSignatureNotExpired, _controllerToken2['default'].checkAuthenticated, _controllerRecord2['default'].getAllRecords);
    router.get('/admin/records/statics', _controllerToken2['default'].checkSignatureNotExpired, _controllerToken2['default'].checkAuthenticated, _controllerRecord2['default'].getRecordsStatics);

    app.use('/api', router);
};
//
//
//module.exports = router;