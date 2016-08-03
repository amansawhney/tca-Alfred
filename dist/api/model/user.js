
//var db = require(__dirname + '/../common/db');
//var Schema = db.Schema;

//var bcrypt = require('bcrypt');
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongooseModelUpdate = require('mongoose-model-update');

var _mongooseModelUpdate2 = _interopRequireDefault(_mongooseModelUpdate);

var _utilsMongoose_unixtimestamp = require('../utils/mongoose_unixtimestamp');

var _utilsMongoose_unixtimestamp2 = _interopRequireDefault(_utilsMongoose_unixtimestamp);

var SALT_WORK_FACTOR = 10;

var User = new _mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        required: 'Username is required. '
    },
    email: {
        type: String,
        required: 'Email is required. '
    },
    firstName: { type: String, 'default': '' },
    lastName: { type: String, 'default': '' },
    photo: { type: String, 'default': '' },
    password: {
        type: String,
        required: 'Password is required. ',
        select: false
    },
    userType: { type: String, 'enum': ['admin', 'general'] },
    phone: {
        type: String, 'default': ''
    },
    settings: {}
});

/**
 * Validations
 */

var validatePresenceOf = function validatePresenceOf(value) {
    return value && value.length;
};

User.path('username').validate(function (username) {
    return (/[A-Za-z]{1}[A-Z0-9a-z_.-]*/.test(username)
    );
}, 'Not a valid username');

User.path('username').validate(function (username, fn) {
    var userModel = _mongoose2['default'].model('users');
    // Check only when it is a new user or when username field is modified
    userModel.find({ username: username }).exec(function (err, users) {
        //return true;
        fn(!err && users.length === 0);
    });
}, 'Username already exists.');

User.path('email').validate(function (email) {
    return (/[A-Za-z]{1}[A-Z0-9a-z_.-]*/.test(email)
    );
}, 'Not a valid email');

User.statics = {
    generatePassword: function generatePassword(newPassword) {
        var salt = _bcrypt2['default'].genSaltSync(SALT_WORK_FACTOR);
        var hash = _bcrypt2['default'].hashSync(newPassword, salt);
        return hash;
    }
};

User.methods = {
    //generatePassword: function(newPassword, cb) {
    //    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    //        if (err) return cb(err);
    //
    //        // hash the password using our new salt
    //        bcrypt.hash(newPassword, salt, function(err, hash) {
    //            if (err) return cb(err);
    //
    //            // override the cleartext password with the hashed one
    //            cb(null, hash);
    //        });
    //    });
    //},
    //comparePassword: function(candidatePassword, cb) {
    //    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    //        if (err) return cb(err);
    //        cb(null, isMatch);
    //    });
    //}
    comparePassword: function comparePassword(candidatePassword) {
        return _bcrypt2['default'].compareSync(candidatePassword, this.password);
    }
};
User.plugin(_utilsMongoose_unixtimestamp2['default']);

module.exports = _mongoose2['default'].model('users', User);
_bluebird2['default'].promisifyAll(module.exports);
_bluebird2['default'].promisifyAll(module.exports.prototype);