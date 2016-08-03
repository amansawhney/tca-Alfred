"use strict";

var _regeneratorRuntime = require("babel-runtime/regenerator")["default"];

var _model = require('../model');

function getMyRecords(req, res, next) {
    var user_id, offset, limit, records;
    return _regeneratorRuntime.async(function getMyRecords$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                user_id = req.decoded._id;
                offset = 0;
                limit = 20;
                context$1$0.next = 5;
                return _regeneratorRuntime.awrap(_model.Record.find({}, null, { sort: { createdAt: -1 }, skip: 0, limit: limit }));

            case 5:
                records = context$1$0.sent;
                return context$1$0.abrupt("return", res.status(200).send({
                    records: records
                }));

            case 7:
            case "end":
                return context$1$0.stop();
        }
    }, null, this);
}

function getAllRecords(req, res, next) {
    var offset, limit, querySet, dtStart, startUnixTimestamp, dtEnd, endUnixTimestamp, records;
    return _regeneratorRuntime.async(function getAllRecords$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                offset = 0;
                limit = 10000;
                querySet = {};

                if (req.query.filter == "filter") {
                    try {
                        if (req.query.currDate && req.query.currDate != "all") {
                            querySet.date = req.query.currDate;
                        }
                        if (req.query.client && req.query.client != "all") {
                            querySet.client = req.query.client;
                        }
                        if (req.query.fcm && req.query.fcm != "all") {
                            querySet.fcm = req.query.fcm;
                        }
                        if (req.query.trader && req.query.trader != "all") {
                            querySet.trader = req.query.trader;
                        }
                        if (req.query.algo && req.query.algo != "all") {
                            querySet.algo = req.query.algo;
                        }
                        if (req.query.exchange && req.query.exchange != "all") {
                            querySet.exchange = req.query.exchange;
                        }
                        if (req.query.instrument && req.query.instrument != "all") {
                            querySet.instrument = req.query.instrument;
                        }

                        if (req.query.minSize && req.query.minSize != "" && req.query.maxSize && req.query.maxSize != "") {
                            querySet.size = { $gt: req.query.minSize, $lt: req.query.maxSize };
                        } else if (req.query.minSize && req.query.minSize != "") {
                            querySet.size = { $gt: req.query.minSize };
                        } else if (req.query.maxSize && req.query.maxSize != "") {
                            querySet.size = { $lt: req.query.maxSize };
                        }

                        if (req.query.startDate && req.query.endDate) {
                            dtStart = new Date(req.query.startDate);
                            startUnixTimestamp = dtStart / 1000;
                            dtEnd = new Date(req.query.endDate);
                            endUnixTimestamp = dtEnd / 1000 + 60 * 60 * 24;

                            querySet.dateUTC = { $gt: startUnixTimestamp, $lt: endUnixTimestamp };
                        } else if (req.query.startDate) {
                            dtStart = new Date(req.query.startDate);
                            startUnixTimestamp = dtStart / 1000;

                            querySet.dateUTC = { $gt: startUnixTimestamp };
                        } else if (req.query.endDate) {
                            dtEnd = new Date(req.query.endDate) + 60 * 60 * 24;
                            endUnixTimestamp = dtEnd / 1000;

                            querySet.dateUTC = { $lt: endUnixTimestamp };
                        }
                        //console.log(req.query);
                        //console.log(querySet);
                    } catch (err) {
                        console.log(err);
                    }
                }

                context$1$0.next = 6;
                return _regeneratorRuntime.awrap(_model.Record.findAsync(querySet, null, { sort: { createdAt: -1 }, skip: offset, limit: limit }));

            case 6:
                records = context$1$0.sent;
                return context$1$0.abrupt("return", res.status(200).send({
                    records: records
                }));

            case 8:
            case "end":
                return context$1$0.stop();
        }
    }, null, this);
}

function getRecordsWithFilters(req, res, next) {
    var offset, limit, querySet, records;
    return _regeneratorRuntime.async(function getRecordsWithFilters$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                offset = 0;
                limit = 10;
                querySet = {};

                if (req.query.client != "all") {
                    querySet.client = req.query.client;
                }
                if (req.query.fcm != "all") {
                    querySet.fcm = req.query.fcm;
                }
                if (req.query.trader != "all") {
                    querySet.trader = req.query.trader;
                }
                if (req.query.algo != "all") {
                    querySet.algo = req.query.algo;
                }
                if (req.query.exchange != "all") {
                    querySet.exchange = req.query.exchange;
                }
                if (req.query.instrument != "all") {
                    querySet.instrument = req.query.instrument;
                }

                if (req.query.minSize != "" && req.query.maxSize != "") {
                    querySet.size = { $gt: req.query.minSize, $lt: req.query.maxSize };
                } else if (req.query.minSize != "") {
                    querySet.size = { $gt: req.query.minSize, $lt: req.query.maxSize };
                }
                context$1$0.next = 12;
                return _regeneratorRuntime.awrap(_model.Record.findAsync(querySet, null, { sort: { createdAt: -1 }, skip: offset, limit: limit }));

            case 12:
                records = context$1$0.sent;
                return context$1$0.abrupt("return", res.status(200).send({
                    records: records
                }));

            case 14:
            case "end":
                return context$1$0.stop();
        }
    }, null, this);
}
function getRecordsStatics(req, res, next) {
    var clients, fcms, traders, exchs, algos, instruments, dates;
    return _regeneratorRuntime.async(function getRecordsStatics$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.next = 2;
                return _regeneratorRuntime.awrap(_model.Record.find().distinct('client'));

            case 2:
                clients = context$1$0.sent;
                context$1$0.next = 5;
                return _regeneratorRuntime.awrap(_model.Record.find().distinct('fcm'));

            case 5:
                fcms = context$1$0.sent;
                context$1$0.next = 8;
                return _regeneratorRuntime.awrap(_model.Record.find().distinct('trader'));

            case 8:
                traders = context$1$0.sent;
                context$1$0.next = 11;
                return _regeneratorRuntime.awrap(_model.Record.find().distinct('exch'));

            case 11:
                exchs = context$1$0.sent;
                context$1$0.next = 14;
                return _regeneratorRuntime.awrap(_model.Record.find().distinct('algo'));

            case 14:
                algos = context$1$0.sent;
                context$1$0.next = 17;
                return _regeneratorRuntime.awrap(_model.Record.find().distinct('instrument'));

            case 17:
                instruments = context$1$0.sent;
                context$1$0.next = 20;
                return _regeneratorRuntime.awrap(_model.Record.find().distinct('date'));

            case 20:
                dates = context$1$0.sent;
                return context$1$0.abrupt("return", res.status(200).send({
                    clients: clients,
                    fcms: fcms,
                    traders: traders,
                    exchs: exchs,
                    algos: algos,
                    instruments: instruments,
                    dates: dates
                }));

            case 22:
            case "end":
                return context$1$0.stop();
        }
    }, null, this);
}

function deleteRecordById(req, res, next) {
    var record_id, record;
    return _regeneratorRuntime.async(function deleteRecordById$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                record_id = req.params.id;
                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(_model.Record.findOneAsync({ _id: record_id }));

            case 3:
                record = context$1$0.sent;

                if (record) {
                    record.remove();
                }

                return context$1$0.abrupt("return", res.status(200).send({
                    message: 'Record deleted successfully.',
                    record_id: record_id
                }));

            case 6:
            case "end":
                return context$1$0.stop();
        }
    }, null, this);
}

module.exports = {
    getMyRecords: getMyRecords,
    getAllRecords: getAllRecords,
    deleteRecordById: deleteRecordById,
    getRecordsStatics: getRecordsStatics
};

//var search_keyword = req.query.search_keyword;
//console.log("getMyRecords");
//req.query.offset

//var search_keyword = req.query.search_keyword;
//req.query.offset

//console.log(records);

//let clients = await Record.find().distinct('client');
//console.log(clients);
//req.query.offset

//let clients = await Record.find().distinct('client');
//console.log(clients);

//console.log("getRecordsStatics");

//console.log(instruments);