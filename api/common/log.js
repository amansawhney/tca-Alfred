

'use strict';

var through = require('through');
var winston = require('winston');

var logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            silent: process.env.NODE_ENV === 'test',
            colorize: true,
            timestamp: true
        })
    ]
});

logger.asStream = function asStream(level){
    return through(function(data){
        logger.log(level, String(data));
    });
};


module.exports = logger;
