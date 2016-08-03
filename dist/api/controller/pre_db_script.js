"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _model = require('../model');

function addUser(username, email, password, userType) {
    var user, newUser;
    return _regeneratorRuntime.async(function addUser$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                //console.log("signup called");
                console.log("addUser");

                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(_model.User.findOneAsync({ $or: [{ username: username }] }));

            case 3:
                user = context$1$0.sent;

                if (user) {
                    context$1$0.next = 13;
                    break;
                }

                newUser = new _model.User();

                newUser.password = _model.User.generatePassword(password);
                newUser.username = username;
                newUser.email = email;
                newUser.userType = userType;
                context$1$0.next = 12;
                return _regeneratorRuntime.awrap(newUser.save());

            case 12:

                console.log("SUCCESS");

            case 13:
            case "end":
                return context$1$0.stop();
        }
    }, null, this);
}

module.exports = {
    addUser: addUser
};

addUser("admin", "admin@gmail.com", "admin", "admin");