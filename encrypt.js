
//import database from './config/database';
//import bodyParser from 'body-parser';
//import scheduler from './api/controller/scheduler';
var config = require('./api/common/config');
var crypto = require('crypto'),
    algorithm = config.encryption_algorithm,
    password = config.encryption_password;
//var crypto = require('crypto'),
//    algorithm = 'aes-256-ctr',//config.encryption_algorithm,
//    password = 'a1e31f3q';//config.encryption_password;
var sourcePath = '';
var destPath = '';
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    if(index == 2)
    {
        sourcePath = val;
    }
    if(index == 3)
    {
        destPath = val;
    }
});
function encryptJSON(source, destination)
{

    try {

        var fs = require('fs');
        var zlib = require('zlib');

// input file
        var r = fs.createReadStream(source);
// zip content
        var zip = zlib.createGzip();
// encrypt content
        var encrypt = crypto.createCipher(algorithm, password);
// write file
        var w = fs.createWriteStream(destination);

// start pipe
        r.pipe(zip).pipe(encrypt).pipe(w);
    }catch(err)
    {
        console.log(err);
    }

    console.log("encryptJSON - Done");
}
if((sourcePath != '') && (destPath != ''))
{
    //encryptJSON("/Volumes/WORK/XCodeProjects/Projects/AmanSawhney/tca-Alfred/sample/data_original.json", "/Volumes/WORK/XCodeProjects/Projects/AmanSawhney/tca-Alfred/sample/data_target.json");
    encryptJSON(sourcePath, destPath);
    console.log("Encrypt hala");
}

//scheduler.encryptJSON();