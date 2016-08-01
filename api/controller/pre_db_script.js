import { User } from '../model'

async function addUser(username, email, password, userType) {
    //console.log("signup called");
    console.log("addUser");

    let user = await User.findOneAsync({ $or:[{username: username}]});

    if(!user)
    {
        var newUser = new User();
        newUser.password = User.generatePassword(password);
        newUser.username = username;
        newUser.email = email;
        newUser.userType = userType;
        await newUser.save();

        console.log("SUCCESS");
    }
}

module.exports = {
    addUser: addUser
};

addUser("admin", "admin@gmail.com", "admin", "admin");