
//import database from './config/database';
'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _apiCommonLog = require('./api/common/log');

var _apiCommonLog2 = _interopRequireDefault(_apiCommonLog);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _apiControllerScheduler = require('./api/controller/scheduler');

var _apiControllerScheduler2 = _interopRequireDefault(_apiControllerScheduler);

var _apiControllerPre_db_script = require('./api/controller/pre_db_script');

var _apiControllerPre_db_script2 = _interopRequireDefault(_apiControllerPre_db_script);

//import './config/seed'

var app = (0, _express2['default'])();
var config = require('./api/common/config');
app.set('superSecret', config.secret);

app.use(_bodyParser2['default'].urlencoded({ extended: false }));
app.use(_bodyParser2['default'].json());

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

app.use(_express2['default']['static']('./public'));
app.use('/uploads', _express2['default']['static'](__dirname + '/uploads'));

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

var j = schedule.scheduleJob('*/15 * * * *', function () {
    //console.log('The answer to life, the universe, and everything!');
    _apiControllerScheduler2['default'].refreshDatabaseFromSource();
});
_apiControllerScheduler2['default'].refreshDatabaseFromSource();

_apiControllerPre_db_script2['default'].addUser();
//scheduler.sendPriorNotice();

if (process.env.PORT === undefined) {
    console.log("Server Started at port : " + 3000);
} else {
    console.log("Server Started at port : " + process.env.PORT);
}