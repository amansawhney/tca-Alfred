
let config = require('../common/config');
import { Record, User } from '../model'

async function refreshDatabaseFromSource() {
    console.log("refreshDatabaseFromSource");
    let currentTime = Date.now() / 1000;


    //Need to fill the database from JSON or CSV

    var fs = require('fs');
    var jsonRecords = await JSON.parse(fs.readFileSync(config.json_file_path, 'utf8'));
    //console.log(jsonRecords);
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
                newRecord.ap = jsonRecord["%AP"];
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
    //console.log(records);
    try {
        await Record.remove({});
        await Record.collection.insert(records);
    }catch(err)
    {
        console.log(err);
    }

    console.log("Done");
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
    refreshDatabaseFromSource: refreshDatabaseFromSource
};