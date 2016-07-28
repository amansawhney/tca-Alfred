
import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import update from 'mongoose-model-update';
import UnixTimestamps from '../utils/mongoose_unixtimestamp';

/*
 {"Date":"5/13/2016","Client":"MYCK","Trader":"EEREV","Exch":"CASH","Algo":"STROBE","Instrument":"Corn","FCM":"JP Morgan","Size":4033,"Filled":5837,"Duration":"210.0","%Volume":"72.6",
 "%iVolume":42,"%Passive":61,"%Cleanup":91,"AP":"29.847","STF":"9.342","IVWAP":"-37.877","VWAP":"-20.252","TWAP":-32}*/


let Record = new Schema({
    date: {       type: String, default: ''   },
    client: {       type: String, default: ''   },
    trader: {       type: String, default: ''   },
    exch: {       type: String, default: ''   },
    algo: {       type: String, default: ''   },
    instrument: {       type: String, default: ''   },
    fcm: {       type: String, default: ''   },
    size: {      type: Number, default: 0   },
    filled: {      type: Number, default: 0   },
    duration: {      type: Number, default: 0   },
    volume: {      type: Number, default: 0   },
    ivolume: {      type: Number, default: 0   },
    passive: {      type: Number, default: 0   },
    cleanup: {      type: Number, default: 0   },
    ap: {      type: Number, default: 0   },
    stf: {      type: Number, default: 0   },
    ivwap: {      type: Number, default: 0   },
    vwap: {      type: Number, default: 0   },
    twap: {      type: Number, default: 0   }
});


Record.plugin(UnixTimestamps);
module.exports = mongoose.model('records', Record);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);