

import { Record, User } from '../model'

async function getMyRecords(req, res, next) {

    var user_id = req.decoded._id;
    //var search_keyword = req.query.search_keyword;
    //console.log("getMyRecords");
    let records = await Record.find({$or:[{'creator': user_id},{'invitee':user_id}]}, null, {sort: {createdAt: -1}, skip: req.query.offset, limit: req.query.limit});

    return res.status(200).send({
        records: records
    });
}

async function getAllRecords(req, res, next) {

    var search_keyword = req.query.search_keyword;

    let records = await Record.findAsync({name: {$regex: search_keyword, $options: "i"}}, null, {sort: {createdAt: -1}, skip: req.query.offset, limit: req.query.limit});

    return res.status(200).send({
        records: records
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
    deleteRecordById: deleteRecordById
}