'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _model = require('../model');

var jwt = require('jsonwebtoken');
var config = require('../common/config');

function signUp(req, res, next) {
    var newUser, username, email, user, userInfoToToken, token, plainUserObject;
    return _regeneratorRuntime.async(function signUp$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                console.log("signup called");
                newUser = new _model.User(req.body);
                username = req.body.username;
                email = req.body.email;
                context$1$0.next = 6;
                return _regeneratorRuntime.awrap(_model.User.findOneAsync({ $or: [{ username: username }, { email: email }] }));

            case 6:
                user = context$1$0.sent;

                console.log("signup called111");

                if (!user) {
                    context$1$0.next = 12;
                    break;
                }

                if (!(user.email == email)) {
                    context$1$0.next = 11;
                    break;
                }

                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Email address already exists. Try another email address.'
                }));

            case 11:
                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Username already exists. Try another username.'
                }));

            case 12:

                //console.log("signup called1");

                newUser.password = _model.User.generatePassword(req.body.password);
                newUser.settings = { push: "1", email: "1", notice: "60" };

                context$1$0.next = 16;
                return _regeneratorRuntime.awrap(newUser.save());

            case 16:
                userInfoToToken = { _id: newUser._id, email: newUser.email, username: newUser.username };
                token = jwt.sign(userInfoToToken, config.secret, {
                    expiresIn: 17280000 // expires in 100 days hours
                });
                plainUserObject = newUser.toObject();

                delete plainUserObject['password'];

                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Successfully registered',
                    api_token: token,
                    user: plainUserObject
                }));

            case 21:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function logIn(req, res, next) {
    var username, password, user, userInfoToToken, token, plainUserObject;
    return _regeneratorRuntime.async(function logIn$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                username = req.body.username;
                password = req.body.password;
                context$1$0.next = 4;
                return _regeneratorRuntime.awrap(_model.User.findOne({ username: username }).select("+password +payment_info"));

            case 4:
                user = context$1$0.sent;

                if (user) {
                    context$1$0.next = 7;
                    break;
                }

                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Invalid username or password!'
                }));

            case 7:
                if (user.comparePassword(password)) {
                    context$1$0.next = 9;
                    break;
                }

                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Invalid username or password!'
                }));

            case 9:
                userInfoToToken = { _id: user._id, email: user.email, username: user.username };
                token = jwt.sign(userInfoToToken, config.secret, {
                    expiresIn: 17280000 // expires in 100 days hours
                });
                plainUserObject = user.toObject();

                delete plainUserObject['password'];

                return context$1$0.abrupt('return', res.status(200).send({
                    api_token: token,
                    user: plainUserObject
                }));

            case 14:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}
function getMeInfo(req, res, next) {
    var userId, user, userInfoToToken, token, plainUserObject;
    return _regeneratorRuntime.async(function getMeInfo$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                userId = req.decoded._id;
                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(_model.User.findOne({ _id: userId }).select("+payment_info"));

            case 3:
                user = context$1$0.sent;

                if (user) {
                    context$1$0.next = 6;
                    break;
                }

                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'User not found!'
                }));

            case 6:
                userInfoToToken = { _id: user._id, email: user.email, username: user.username };
                token = jwt.sign(userInfoToToken, config.secret, {
                    expiresIn: 17280000 // expires in 100 days
                });
                plainUserObject = user.toObject();
                return context$1$0.abrupt('return', res.status(200).send({
                    api_token: token,
                    user: plainUserObject
                }));

            case 10:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function loginAdmin(req, res, next) {
    var email, password, user, token, plainUserObject;
    return _regeneratorRuntime.async(function loginAdmin$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                email = req.body.email;
                password = req.body.password;
                context$1$0.next = 4;
                return _regeneratorRuntime.awrap(_model.User.findOne({ email: email }).select("+password"));

            case 4:
                user = context$1$0.sent;

                console.log(_model.User.generatePassword(req.body.password));
                console.log(user);

                if (user) {
                    context$1$0.next = 9;
                    break;
                }

                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Invalid email or password!'
                }));

            case 9:
                if (user.comparePassword(password)) {
                    context$1$0.next = 11;
                    break;
                }

                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Invalid email or password!'
                }));

            case 11:
                token = jwt.sign(user, config.secret, {
                    expiresIn: 17280000 // expires in 100 days
                });
                plainUserObject = user.toObject();

                delete plainUserObject['password'];

                return context$1$0.abrupt('return', res.status(200).send({
                    api_token: token,
                    user: plainUserObject
                }));

            case 15:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function forgotPassword(req, res, next) {
    var email, user, token;
    return _regeneratorRuntime.async(function forgotPassword$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                email = req.body.email;
                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(_model.User.findOneAsync({ email: email }));

            case 3:
                user = context$1$0.sent;

                if (user) {
                    context$1$0.next = 6;
                    break;
                }

                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'No User Have been Found with the Email!'
                }));

            case 6:
                token = jwt.sign(user._id, config.secret, {
                    expiresInMinutes: 20 // expires in 20 mins
                });

                sendgrid.sendForgotPasswordEmail(email, token, user.username);
                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Email has been successfully sent!',
                    email: email
                }));

            case 9:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function showResetPage(req, res, next) {
    var token;
    return _regeneratorRuntime.async(function showResetPage$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                token = req.params.token;

                jwt.verify(token, config.secret, function callee$1$0(err, decoded) {
                    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
                        while (1) switch (context$2$0.prev = context$2$0.next) {
                            case 0:
                                if (err) {
                                    res.render('invalid_token.ejs');
                                    //return res.status(200).send({message: 'Failed to authenticate token.'});
                                } else {
                                        res.render('reset.ejs');
                                    }

                            case 1:
                            case 'end':
                                return context$2$0.stop();
                        }
                    }, null, this);
                });

            case 2:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function resetPassword(req, res, next) {
    var token, password;
    return _regeneratorRuntime.async(function resetPassword$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                token = req.params.token;
                password = req.body.password;

                jwt.verify(token, config.secret, function callee$1$0(err, decoded) {
                    var user, hashedPassword;
                    return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
                        while (1) switch (context$2$0.prev = context$2$0.next) {
                            case 0:
                                if (!err) {
                                    context$2$0.next = 4;
                                    break;
                                }

                                res.render('password_reset_failed.ejs');
                                context$2$0.next = 16;
                                break;

                            case 4:
                                context$2$0.next = 6;
                                return _regeneratorRuntime.awrap(_model.User.findById(decoded));

                            case 6:
                                user = context$2$0.sent;

                                if (!user) {
                                    context$2$0.next = 15;
                                    break;
                                }

                                hashedPassword = _model.User.generatePassword(password);
                                context$2$0.next = 11;
                                return _regeneratorRuntime.awrap(_model.User.update({ _id: user._id }, { $set: { password: hashedPassword } }, { upsert: false, runValidators: true }));

                            case 11:
                                sendgrid.sendResetPasswordEmail(user.email, user.username);

                                res.render('password_reset.ejs');
                                context$2$0.next = 16;
                                break;

                            case 15:
                                res.render('password_reset_failed.ejs');

                            case 16:
                            case 'end':
                                return context$2$0.stop();
                        }
                    }, null, this);
                });

            case 3:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}
function users(req, res, next) {
    var userId, users;
    return _regeneratorRuntime.async(function users$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                userId = req.decoded._id;
                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(_model.User.find({ _id: { $ne: userId } }, null, { sort: { createdAt: -1 }, skip: req.query.offset, limit: req.query.limit }));

            case 3:
                users = context$1$0.sent;
                return context$1$0.abrupt('return', res.status(200).send({
                    users: users
                }));

            case 5:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function updateProfile(req, res, next) {
    var userId, changeSet, file, filename, user;
    return _regeneratorRuntime.async(function updateProfile$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.prev = 0;
                userId = req.decoded._id;
                changeSet = JSON.parse(req.body.updatelist);

                if (req.files) {
                    file = req.files.image;
                    filename = req.files.image.name;

                    changeSet.photo = file.path;
                }

                context$1$0.next = 6;
                return _regeneratorRuntime.awrap(_model.User.findByIdAndUpdate(userId, { $set: changeSet }, { upsert: false, runValidators: true, 'new': true }).exec());

            case 6:
                user = context$1$0.sent;
                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Your profile has been successfully updated',
                    user: user
                }));

            case 10:
                context$1$0.prev = 10;
                context$1$0.t0 = context$1$0['catch'](0);
                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Failed to update profile'
                }));

            case 13:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this, [[0, 10]]);
}

function changePassword(req, res, next) {
    var userId, user, hashedPassword;
    return _regeneratorRuntime.async(function changePassword$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                userId = req.decoded._id;
                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(_model.User.findOne({ _id: userId }).select("+password"));

            case 3:
                user = context$1$0.sent;

                if (user) {
                    context$1$0.next = 6;
                    break;
                }

                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Internal Server Error'
                }));

            case 6:
                if (user.comparePassword(req.body.originalPassword)) {
                    context$1$0.next = 8;
                    break;
                }

                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Input wrong original password!'
                }));

            case 8:
                hashedPassword = _model.User.generatePassword(req.body.password);
                context$1$0.next = 11;
                return _regeneratorRuntime.awrap(_model.User.update({ _id: userId }, { $set: { password: hashedPassword } }, { upsert: false, runValidators: true }));

            case 11:
                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Your password has been successfully updated'
                }));

            case 12:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function createUser(req, res, next) {
    return _regeneratorRuntime.async(function createUser$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                return context$1$0.abrupt('return', this.signUp(req, res, next));

            case 1:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function getUser(req, res, next) {
    var userId, user;
    return _regeneratorRuntime.async(function getUser$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                userId = req.params.id;
                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(_model.User.findOneAsync({ _id: userId }));

            case 3:
                user = context$1$0.sent;

                if (user) {
                    context$1$0.next = 6;
                    break;
                }

                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'User not found.'
                }));

            case 6:
                return context$1$0.abrupt('return', res.status(200).send({
                    user: user
                }));

            case 7:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function updateUser(req, res, next) {
    var userId, changeSet;
    return _regeneratorRuntime.async(function updateUser$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                userId = req.params.id;
                changeSet = JSON.parse(req.body.updatelist);
                context$1$0.next = 4;
                return _regeneratorRuntime.awrap(_model.User.update({ _id: userId }, { $set: changeSet }, { upsert: false, runValidators: true }));

            case 4:
                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'Your profile has been successfully updated'
                }));

            case 5:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function deleteUser(req, res, next) {
    var userId, user;
    return _regeneratorRuntime.async(function deleteUser$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                userId = req.params.id;

                console.log("delete /user/:id : " + userId);
                context$1$0.next = 4;
                return _regeneratorRuntime.awrap(_model.User.findOneAsync({ _id: userId }));

            case 4:
                user = context$1$0.sent;

                if (user) {
                    context$1$0.next = 7;
                    break;
                }

                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'User not found.'
                }));

            case 7:
                user.remove();
                return context$1$0.abrupt('return', res.status(200).send({
                    message: 'User deleted successfully.'
                }));

            case 9:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

module.exports = {
    signUp: signUp,
    logIn: logIn,
    loginAdmin: loginAdmin,
    forgotPassword: forgotPassword,
    showResetPage: showResetPage,
    resetPassword: resetPassword,
    users: users,
    updateProfile: updateProfile,
    changePassword: changePassword,
    createUser: createUser,
    getUser: getUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    getMeInfo: getMeInfo
};

//console.log("signup called2");

//console.log(req.body);
//console.log(password);

//console.log(user);

//var token = jwt.sign(user, config.secret, {
//    expiresIn: 17280000 // expires in 100 days
//});
//console.log(token);

//delete plainUserObject['password'];

//console.log(req.body);
//console.log(password);

//console.log(user);

//console.log(token);

//var searchKeyword = req.query.searchKeyword;