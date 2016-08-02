
let config = require('../common/config');
import { Record, User } from '../model'
// Reference: http://lollyrock.com/articles/nodejs-encryption/

var crypto = require('crypto'),
    algorithm = config.encryption_algorithm,
    password = config.encryption_password;


async function refreshDatabaseFromSource() {
    console.log("refreshDatabaseFromSource");
    let currentTime = Date.now() / 1000;



    var fs = require('fs');
    var zlib = require('zlib');

    try {
// decrypt content
        var decrypt = crypto.createDecipher(algorithm, password)

        var buffer = await fs.readFileSync(config.json_file_path);
        buffer = Buffer.concat([decrypt.update(new Buffer(buffer, "utf8")), decrypt.final()]);
        //console.log(buffer.toString('utf8'));
        //console.log(dec);
        //console.log(buffer);
        zlib.unzip(buffer, function (err, buffer) {
            if (!err) {
                console.log("No ERROR - Decryption Success");
                processRecords(buffer);
            }
            else {
                console.log(err);
            }
        });
        console.log("Encryption Done");
    } catch (err) {
        console.log("Encryption Err");
        console.log(err);
    }

}

async function processRecords(buffer)
{

    try {

        var jsonRecords = await JSON.parse(buffer.toString());
        console.log(jsonRecords.length);
        var records = [];

        jsonRecords.forEach(
            function(jsonRecord){
                try {
                    var newRecord = {};//new Record();
                    newRecord.date = jsonRecord.Date;
                    var dt = new Date(jsonRecord.Date);
                    newRecord.dateUTC = dt / 1000;
                    newRecord.client = jsonRecord.Client;
                    newRecord.trader = jsonRecord.Trader;
                    newRecord.exch = jsonRecord.Exch;
                    newRecord.algo = jsonRecord.Algo;
                    newRecord.instrument = jsonRecord.Instrument;
                    newRecord.fcm = jsonRecord.FCM;
                    newRecord.size = jsonRecord.Size;
                    newRecord.filled = jsonRecord.Filled;
                    newRecord.duration = jsonRecord.Duration;
                    newRecord.volume = jsonRecord["%Volume"];
                    newRecord.ivolume = jsonRecord["%iVolume"];
                    newRecord.passive = jsonRecord["%Passive"];
                    newRecord.cleanup = jsonRecord["%Cleanup"];
                    newRecord.ap = jsonRecord["AP"];
                    newRecord.stf = jsonRecord["STF"];
                    newRecord.ivwap = jsonRecord["IVWAP"];
                    newRecord.vwap = jsonRecord["VWAP"];
                    newRecord.twap = jsonRecord["TWAP"];
                    //if (records.length < 2)
                    //{
                    records.push(newRecord);
                    //}
                    //console.log(newRecord);
                }catch(err)
                {
                    console.log(err);
                }

            });
        await Record.remove({});
        await Record.collection.insert(records);
    }catch(err)
    {
        console.log(err);
    }


     try {
     //fs.unlink("file.out.txt");
     }catch(err)
     {
     console.log(err);
     }


    console.log("Done");
}



async function encryptJSON(source, destination)
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
function onInsert(err, docs) {
    if (err) {
        // TODO: handle error
        console.log(err);
    } else {
        console.info('%d potatoes were successfully stored.', docs.length);
    }
}

module.exports = {
    refreshDatabaseFromSource: refreshDatabaseFromSource,
    encryptJSON: encryptJSON
};