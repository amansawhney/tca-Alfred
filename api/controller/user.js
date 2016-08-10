
let jwt    = require('jsonwebtoken');
let config = require('../common/config');

import { Record, User } from '../model'

async function signUp(req, res, next) {
    console.log("signup called");
    var newUser = new User(req.body);
    var username = req.body.username;
    var email = req.body.email;

    let user = await User.findOneAsync({ $or:[{username: username},{email: email}]});
    //console.log("signup called111");

    if (user)
    {
        if(user.email == email)
        {
            return res.status(200).send({
                message: 'Email address already exists. Try another email address.'
            });
        }
        return res.status(200).send({
            message: 'Username already exists. Try another username.'
        });
    }

    //console.log("signup called1");

    newUser.password = User.generatePassword(req.body.password);

    await newUser.save();

    var userInfoToToken = {_id: newUser._id, email: newUser.email, username: newUser.username};
    var token = jwt.sign(userInfoToToken, config.secret, {
        expiresIn: 17280000 // expires in 100 days hours
    });
    //console.log("signup called2");

    var plainUserObject = newUser.toObject();
    delete plainUserObject['password'];



    return res.status(200).send({
        message: 'Successfully registered',
        api_token: token,
        user: plainUserObject
    });
}


async function createUser(req, res, next) {
    console.log("createUser called");
    //console.log(req.body);
    try {
        var newUser = new User(req.body);
        var username = req.body.username;
        var email = req.body.email;

        let user = await User.findOneAsync({ $or:[{username: username},{email: email}]});

        if (user)
        {
            if(user.email == email)
            {
                return res.status(200).send({
                    message: 'Email address already exists. Try another email address.'
                });
            }
            return res.status(200).send({
                message: 'Username already exists. Try another username.'
            });
        }

        newUser.password = User.generatePassword(req.body.password);
        //newUser.userType = "general";
        //console.log(newUser);

        await newUser.save();

        var plainUserObject = newUser.toObject();
        delete plainUserObject['password'];



        return res.status(200).send({
            message: 'Successfully created',
            user: plainUserObject
        });
    }catch(err)
    {
        console.log(err);
        return res.status(200).send({
            message: err.message
        });

    }

}


async function logIn(req, res, next) {

    var username = req.body.username;
    var password = req.body.password;

    //console.log(req.body);
    //console.log(password);
    let user = await User.findOne({ username: username }).select("+password");

    if (!user) {
        return res.status(200).send({
            message: 'Invalid username or password!'
        });
    }

    //console.log(user);
    if(!user.comparePassword(password)) {
        return res.status(200).send({
            message: 'Invalid username or password!'
        });
    }
    var userInfoToToken = {_id: user._id, email: user.email, username: user.username, userType: user.userType};
    var token = jwt.sign(userInfoToToken, config.secret, {
        expiresIn: 17280000 // expires in 100 days hours
    });

    //var token = jwt.sign(user, config.secret, {
    //    expiresIn: 17280000 // expires in 100 days
    //});
    //console.log(token);

    var plainUserObject = user.toObject();
    delete plainUserObject['password'];

    return res.status(200).send({
        api_token: token,
        user: plainUserObject
    });
}

async function getMeInfo(req, res, next) {

    var userId = req.decoded._id;
    let user = await User.findOne({ _id: userId });

    if (!user) {
        return res.status(200).send({
            message: 'User not found!'
        });
    }
    var userInfoToToken = {_id: user._id, email: user.email, username: user.username};

    var token = jwt.sign(userInfoToToken, config.secret, {
        expiresIn: 17280000 // expires in 100 days
    });

    var plainUserObject = user.toObject();
    //delete plainUserObject['password'];

    return res.status(200).send({
        api_token: token,
        user: plainUserObject
    });
}

async function loginAdmin(req, res, next) {

    var email = req.body.email;
    var password = req.body.password;

    //console.log(req.body);
    //console.log(password);
    let user = await User.findOne({ email: email }).select("+password");

    //console.log(User.generatePassword(req.body.password));
    //console.log(user);
    if (!user) {
        return res.status(200).send({
            message: 'Invalid email or password!'
        });
    }

    //console.log(user);
    if(!user.comparePassword(password)) {
        return res.status(200).send({
            message: 'Invalid email or password!'
        });
    }

    var userInfoToToken = {_id: user._id, email: user.email, username: user.username, userType: user.userType};
    //console.log(userInfoToToken);
    var token = jwt.sign(userInfoToToken, config.secret, {
        expiresIn: 17280000 // expires in 100 days
    });

    //console.log(token);

    var plainUserObject = user.toObject();
    delete plainUserObject['password'];

    return res.status(200).send({
        api_token: token,
        user: plainUserObject
    });
}

async function forgotPassword(req, res, next) {

    var email = req.body.email;

    let user = await User.findOneAsync({ email: email });
    if (!user)
    {
        return res.status(200).send({
            message: 'No User Have been Found with the Email!'
        });
    }

    const token = jwt.sign(user._id, config.secret, {
        expiresInMinutes: 20 // expires in 20 mins
    });

    sendgrid.sendForgotPasswordEmail(email, token, user.username);
    return res.status(200).send({
        message: 'Email has been successfully sent!',
        email: email
    });
}

async function showResetPage(req, res, next) {
    const {token} = req.params;
    jwt.verify(token, config.secret, async function(err, decoded) {
        if (err) {
            res.render('invalid_token.ejs');
            //return res.status(200).send({message: 'Failed to authenticate token.'});
        } else {
            res.render('reset.ejs');
        }
    });
}


async function resetPassword(req, res, next) {

    const {token} = req.params;
    const {password} = req.body;
    jwt.verify(token, config.secret, async function(err, decoded) {
        if (err) {
            res.render('password_reset_failed.ejs');
        } else {
            const user = await User.findById(decoded);
            if(user) {
                const hashedPassword =  User.generatePassword(password);
                await User.update({_id: user._id}, { $set: {password: hashedPassword} }, {upsert:false, runValidators:true});
                sendgrid.sendResetPasswordEmail(user.email, user.username);

                res.render('password_reset.ejs');
            }
            else {
                res.render('password_reset_failed.ejs');
            }

        }
    });
}
async function users(req, res, next) {

    var userId = req.decoded._id;

    //console.log(userId);
    if(req.decoded.userType != "admin")
    {
        return res.status(200).send({
            message: "You don't have permission",
            users: {}
        });
    }

    //var searchKeyword = req.query.searchKeyword;


    let users = await User.find({_id: {$ne: userId}}, null, {sort: {createdAt: -1}, skip: req.query.offset, limit: req.query.limit});

    return res.status(200).send({
        users: users
    });
}

async function updateProfile(req, res, next) {
    try {
        var userId = req.decoded._id;

        var changeSet = JSON.parse(req.body.updatelist);
        if(req.files)
        {
            let file = req.files.image;
            let filename = req.files.image.name;

            changeSet.photo = file.path;
        }

        let user = await User.findByIdAndUpdate(userId, { $set: changeSet}, {upsert:false, runValidators:true, new: true}).exec();

        return res.status(200).send({
            message: 'Your profile has been successfully updated',
            user:user
        });
    }catch(err)
    {
        return res.status(200).send({
            message: 'Failed to update profile'
        });
    }

}

async function changePassword(req, res, next) {

    var userId = req.decoded._id;
    let user = await User.findOne({ _id: userId }).select("+password");


    if (!user) {

        return res.status(200).send({
            message: 'Internal Server Error'
        });
    }

    if(!user.comparePassword(req.body.originalPassword))
    {
        return res.status(200).send({
            message: 'Input wrong original password!'
        });
    }

    var hashedPassword = User.generatePassword(req.body.password);
    await User.update({_id: userId}, { $set: {password: hashedPassword} }, {upsert:false, runValidators:true});

    return res.status(200).send({
        message: 'Your password has been successfully updated'
    });
}

async function getUser(req, res, next) {

    var userId = req.params.id;

    let user = await User.findOneAsync({ _id: userId });
    if (!user) {
        return res.status(200).send({
            message: 'User not found.'
        });
    }

    return res.status(200).send({
        user: user
    });

}

async function updateUser(req, res, next) {

    var userId = req.params.id;
    console.log(userId);
    try {
        var changeSet = {firstName: req.body.firstName, lastName: req.body.lastName, clients: req.body.clients, traders: req.body.traders};
        if (req.body.password && req.body.password != "")
        {
            var hashedPassword = User.generatePassword(req.body.password);
            changeSet.password = hashedPassword;
        }

        if (req.body.userType && req.body.userType != "")
        {
            changeSet.userType = req.body.userType;
        }


        await User.update({_id: userId}, { $set: changeSet }, {upsert:false, runValidators:true});
    }
    catch(err)
    {
        console.log(err);
        return res.status(200).send({
            message: err.message
        });
    }
    return res.status(200).send({
        message: 'Your profile has been successfully updated'
    });
}

async function deleteUser(req, res, next) {

    var userId = req.params.id;
    console.log("delete /user/:id : " + userId);
    let user = await User.findOneAsync({ _id: userId });

    if (!user) {
        return res.status(200).send({
            message: 'User not found.'
        });
    }
    user.remove();
    return res.status(200).send({
        message: 'User deleted successfully.'
    });
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
}
