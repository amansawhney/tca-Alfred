
//var db = require(__dirname + '/../common/db');
//var Schema = db.Schema;

//var bcrypt = require('bcrypt');
import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import update from 'mongoose-model-update';
import UnixTimestamps from '../utils/mongoose_unixtimestamp'

var SALT_WORK_FACTOR = 10;



var User = new Schema({
    username: {
        type: String,
        index:true,
        unique: true,
        required: 'Username is required. '
    },
    email: {
        type: String,
        required: 'Email is required. '
    },
    firstName: {type: String, default: ''},
    lastName: {type: String, default: ''},
    photo: {type: String, default: ''},
    password: {
        type: String,
        required: 'Password is required. ',
        select: false
    },
    userType: { type: String, enum: ['admin', 'general'] },
    phone: {
        type: String, default: ''
    },
    settings:{},
});


/**
 * Validations
 */

var validatePresenceOf = function (value) {
    return value && value.length
};


User.path('username').validate(function (username) {
    return  /[A-Za-z]{1}[A-Z0-9a-z_.-]*/.test(username);
}, 'Not a valid username');

User.path('username').validate(function (username, fn) {
    var userModel = mongoose.model('users');
    // Check only when it is a new user or when username field is modified
    userModel.find({ username: username }).exec(function (err, users) {
        //return true;
        fn((!err && users.length === 0));
    });
}, 'Username already exists.');

User.path('email').validate(function (email) {
    return  /[A-Za-z]{1}[A-Z0-9a-z_.-]*/.test(email);
}, 'Not a valid email');

User.statics = {
    generatePassword: function(newPassword) {
        var salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
        var hash = bcrypt.hashSync(newPassword, salt);
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
    comparePassword: function(candidatePassword) {
        return bcrypt.compareSync(candidatePassword, this.password);
    }
};
User.plugin(UnixTimestamps);


module.exports = mongoose.model('users', User);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);