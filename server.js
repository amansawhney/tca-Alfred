
//import database from './config/database';
import express from 'express';
import morgan from 'morgan';
import logger from './api/common/log';
import bodyParser from 'body-parser';
import scheduler from './api/controller/scheduler';
import pre_db_script from './api/controller/pre_db_script';

//import './config/seed'

let app = express();
var config = require('./api/common/config');
app.set('superSecret', config.secret);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
app.set('view engine', 'ejs');

app.use(express.static('./public'));
app.use('/uploads', express.static(__dirname + '/uploads'));


// routes
//var apiPath = "/api/";
//var apiRoutes = require('./api/routes/route');
////---------API Endpoints----------
//app.use(apiPath, apiRoutes);


require('./api/routes/route')(app);

app.listen(process.env.PORT || 3000);

app.get('/', function (req, res) {
    res.sendfile('./public/index.html');
});
/*
 var stripe = require("stripe")("sk_test_xdwTRVXlUGgjLaMSsOHkY9KG");

 // Using Express
 app.post("/my/webhook/url", function(request, response) {
 // Retrieve the request's body and parse it as JSON
 var event_json = JSON.parse(request.body);

 // Do something with event_json

 response.send(200);
 });*/

var schedule = require('node-schedule');

var j = schedule.scheduleJob('*/15 * * * *', function(){
    //console.log('The answer to life, the universe, and everything!');
    scheduler.refreshDatabaseFromSource();
});
scheduler.refreshDatabaseFromSource();
pre_db_script.addUser();
//scheduler.sendPriorNotice();

if (process.env.PORT === undefined) {
    console.log("Server Started at port : " + 3000);
} else {
    console.log("Server Started at port : " + process.env.PORT);
}
