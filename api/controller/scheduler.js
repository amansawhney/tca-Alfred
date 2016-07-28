
let config = require('../common/config');
import { Record, User } from '../model'

async function refreshDatabaseFromSource() {
    console.log("refreshDatabaseFromSource");
    let currentTime = Date.now() / 1000;


    //Need to fill the database from JSON or CSV


}


module.exports = {
    refreshDatabaseFromSource: refreshDatabaseFromSource
}