
import token from '../controller/token';
import user from '../controller/user';
import record from '../controller/record';


module.exports = function (app){
    var express = require('express');
    var router = express.Router();

    router.post('/user/signup', token.checkSignatureNotExpired, user.signUp);
    router.post('/user/login', token.checkSignatureNotExpired, user.logIn);
    router.post('/admin/login', token.checkSignatureNotExpired, user.loginAdmin);
    router.post('/user/forgotpassword', token.checkSignatureNotExpired, user.forgotPassword);
    router.get('/resetpassword/:token', user.showResetPage);
    router.post('/resetpassword/:token', user.resetPassword);

// Profile API
    router.put('/me/changepassword', token.checkSignatureNotExpired, token.checkAuthenticated, user.changePassword);
    router.put('/me/updateprofile', token.checkSignatureNotExpired, token.checkAuthenticated, user.updateProfile);
    router.post('/me/updateprofile', profileImageUpload, token.checkSignatureNotExpired, token.checkAuthenticated,  user.updateProfile);//,
    router.get('/me/info', token.checkSignatureNotExpired, token.checkAuthenticated,  user.getMeInfo);//,

// User Management APIs
    router.post('/user', token.checkSignatureNotExpired, token.checkAuthenticated, token.checkManagerAdmin, user.signUp);
    //router.get('/users', token.checkSignatureNotExpired, token.checkAuthenticated, token.checkManagerAdmin, user.users);
    router.get('/user/:id', token.checkSignatureNotExpired, token.checkAuthenticated, token.checkManagerAdmin, user.getUser);
    router.delete('/user/:id', token.checkSignatureNotExpired, token.checkAuthenticated, token.checkManagerAdmin, user.deleteUser);
    router.put('/user/:id', token.checkSignatureNotExpired, token.checkAuthenticated, token.checkManagerAdmin, user.updateUser);

//Record Management
    router.get('/me/records', token.checkSignatureNotExpired, token.checkAuthenticated, record.getMyTransactions);
    router.get('/records', token.checkSignatureNotExpired, token.checkAuthenticated, record.getAllTransactions);

    app.use('/api', router);
}
//
//
//module.exports = router;
