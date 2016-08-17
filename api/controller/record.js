

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

    //var search_keyword = req.query.search_keyword;
    try {
        var offset = 0; //req.query.offset
        var limit = 10000000;

        var querySet = {};
        if (req.query.filter == "filter")
        {
            try {
                if (req.query.currDate && req.query.currDate != "all")
                {
                    querySet.date = req.query.currDate;
                }
                if (req.query.client && req.query.client != "all")
                {
                    querySet.client = req.query.client;
                }
                if (req.query.fcm && req.query.fcm != "all")
                {
                    querySet.fcm = req.query.fcm;
                }
                if (req.query.trader && req.query.trader != "all")
                {
                    querySet.trader = req.query.trader;
                }
                if (req.query.algo && req.query.algo != "all")
                {
                    querySet.algo = req.query.algo;
                }
                if (req.query.exchange && req.query.exchange != "all")
                {
                    querySet.exchange = req.query.exchange;
                }
                if (req.query.instrument && req.query.instrument != "all")
                {
                    querySet.instrument = req.query.instrument;
                }

                if ((req.query.minSize && req.query.minSize != "") && (req.query.maxSize && req.query.maxSize != ""))
                {
                    querySet.size = {$gt: req.query.minSize, $lt: req.query.maxSize};
                }
                else if(req.query.minSize && req.query.minSize != "")
                {
                    querySet.size = {$gt: req.query.minSize};
                }
                else if(req.query.maxSize && req.query.maxSize != "")
                {
                    querySet.size = {$lt: req.query.maxSize};
                }

                if (req.query.startDate && req.query.endDate)
                {
                    var dtStart = new Date(req.query.startDate);
                    var startUnixTimestamp = dtStart / 1000;
                    var dtEnd = new Date(req.query.endDate);
                    var endUnixTimestamp = dtEnd / 1000 + 60 * 60 * 24;
                    querySet.dateUTC = {$gt: startUnixTimestamp, $lt: endUnixTimestamp};
                }
                else if(req.query.startDate)
                {
                    var dtStart = new Date(req.query.startDate);
                    var startUnixTimestamp = dtStart / 1000;
                    querySet.dateUTC = {$gt: startUnixTimestamp};
                }
                else if(req.query.endDate)
                {
                    var dtEnd = new Date(req.query.endDate) + 60 * 60 * 24;
                    var endUnixTimestamp = dtEnd / 1000;
                    querySet.dateUTC = {$lt: endUnixTimestamp};
                }
                //console.log(req.query);
                //console.log(querySet);
            }catch(err)
            {
                console.log(err);
            }
        }

        if(req.decoded.userType != "admin")
        {
            var userId = req.decoded._id;
            let user = await User.findOne({ _id: userId });

            if (!user) {
                return res.status(200).send({
                    records: []
                });
            }
            if(user.clients && user.clients.length > 0)
            {
                querySet.client = {$in: user.clients};
            }
            if(user.traders && user.traders.length > 0)
            {
                querySet.trader = {$in: user.traders};
            }
            //console.log(querySet);
        }

        let records = await Record.findAsync(querySet, null, {skip: offset, limit: limit});//sort: {createdAt: -1},
        console.log(records.length);

        //let clients = await Record.find().distinct('client');
        //console.log(clients);
        return res.status(200).send({
            records: records
        });
    }catch(err)
    {
        console.log(err);
        return res.status(200).send({
            records: []
        });
    }

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
    //console.log("getRecordsStatics");
    let clients = await Record.find().distinct('client');
    let traders = await Record.find().distinct('trader');
    //let fcms = await Record.find().distinct('fcm');
    //let exchs = await Record.find().distinct('exch');
    //let algos = await Record.find().distinct('algo');
    //let instruments = await Record.find().distinct('instrument');
    //let dates = await Record.find().distinct('date');
    //console.log(instruments);

    return res.status(200).send({
        clients: clients,
        traders: traders,
        //fcms: fcms,
        //exchs: exchs,
        //algos: algos,
        //instruments: instruments,
        //dates: dates
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