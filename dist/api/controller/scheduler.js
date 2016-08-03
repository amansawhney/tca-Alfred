'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _model = require('../model');

var config = require('../common/config');

function refreshDatabaseFromSource() {
    var currentTime, fs, jsonRecords, records;
    return _regeneratorRuntime.async(function refreshDatabaseFromSource$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                console.log("refreshDatabaseFromSource");
                currentTime = Date.now() / 1000;
                fs = require('fs');
                context$1$0.next = 5;
                return _regeneratorRuntime.awrap(JSON.parse(fs.readFileSync(config.json_file_path, 'utf8')));

            case 5:
                jsonRecords = context$1$0.sent;
                records = [];

                jsonRecords.forEach(function (jsonRecord) {
                    try {
                        var newRecord = {}; //new Record();
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
                    } catch (err) {
                        console.log(err);
                    }
                });
                //console.log(records);
                context$1$0.prev = 8;
                context$1$0.next = 11;
                return _regeneratorRuntime.awrap(_model.Record.remove({}));

            case 11:
                context$1$0.next = 13;
                return _regeneratorRuntime.awrap(_model.Record.collection.insert(records));

            case 13:
                context$1$0.next = 18;
                break;

            case 15:
                context$1$0.prev = 15;
                context$1$0.t0 = context$1$0['catch'](8);

                console.log(context$1$0.t0);

            case 18:

                console.log("Done");

            case 19:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this, [[8, 15]]);
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

//Need to fill the database from JSON or CSV

//console.log(jsonRecords);