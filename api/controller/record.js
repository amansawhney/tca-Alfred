

import { Record, User } from '../model'

async function getMyRecords(req, res, next) {

    var user_id = req.decoded._id;
    //var search_keyword = req.query.search_keyword;
    //console.log("getMyRecords");
    var offset = 0; //req.query.offset
    var limit = 20;
    let records = await Record.find({}, null, {sort: {createdAt: -1}, skip: 0, limit: limit});

    return res.status(200).send({
        records: records
    });
}

async function getAllRecords(req, res, next) {

    var search_keyword = req.query.search_keyword;
    var offset = 0; //req.query.offset
    var limit = 10;
    let records = await Record.findAsync({}, null, {sort: {createdAt: -1}, skip: offset, limit: limit});

    //let clients = await Record.find().distinct('client');
    //console.log(clients);
    return res.status(200).send({
        records: records
    });
}

async function getRecordsWithFilters(req, res, next) {

    var offset = 0; //req.query.offset
    var limit = 10;

    var querySet = {};
    if (req.query.client != "all")
    {
        querySet.client = req.query.client;
    }
    if (req.query.fcm != "all")
    {
        querySet.fcm = req.query.fcm;
    }
    if (req.query.trader != "all")
    {
        querySet.trader = req.query.trader;
    }
    if (req.query.algo != "all")
    {
        querySet.algo = req.query.algo;
    }
    if (req.query.exchange != "all")
    {
        querySet.exchange = req.query.exchange;
    }
    if (req.query.instrument != "all")
    {
        querySet.instrument = req.query.instrument;
    }

    if ((req.query.minSize != "") && (req.query.maxSize != ""))
    {
        querySet.size = {$gt: req.query.minSize, $lt: req.query.maxSize};
    }
    else if(req.query.minSize != "")
    {
        querySet.size = {$gt: req.query.minSize, $lt: req.query.maxSize};
    }
    let records = await Record.findAsync(querySet, null, {sort: {createdAt: -1}, skip: offset, limit: limit});

    //let clients = await Record.find().distinct('client');
    //console.log(clients);
    return res.status(200).send({
        records: records
    });
}
async function getRecordsStatics(req, res, next) {
    console.log("getRecordsStatics");
    let clients = await Record.find().distinct('client');
    let fcms = await Record.find().distinct('fcm');
    let traders = await Record.find().distinct('trader');
    let exchs = await Record.find().distinct('exch');
    let algos = await Record.find().distinct('algo');
    let instruments = await Record.find().distinct('instrument');
    console.log(instruments);

    return res.status(200).send({
        clients: clients,
        fcms: fcms,
        traders: traders,
        exchs: exchs,
        algos: algos,
        instruments: instruments
    });
}



async function deleteRecordById(req, res, next) {

    var record_id = req.params.id;

    let record = await Record.findOneAsync({_id: record_id});

    if (record) {
        record.remove();
    }

    return res.status(200).send({
        message: 'Record deleted successfully.',
        record_id: record_id
    });
}



module.exports = {
    getMyRecords: getMyRecords,
    getAllRecords: getAllRecords,
    deleteRecordById: deleteRecordById,
    getRecordsStatics: getRecordsStatics
}