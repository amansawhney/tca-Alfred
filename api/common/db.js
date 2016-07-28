

var mongoose = require('mongoose');
var config = require(__dirname + '/config');
mongoose.connect(config.mongoUri + config.mongoDbName, function(error){
    if(error) return console.log(error);
    console.log("MongoDB: connection to database successful!");
});
module.exports  = mongoose;