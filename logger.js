const winston = require('winston');
const { createLogger, transports, format } = winston;
const { combine, timestamp, printf, errors } = format;
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

function getLogger(){
    

    // Define the log directory (same as Python logs directory)
    const logDirectory = 'C:\\Users\\bonel\\Desktop\\logs';
    const timestampFormat = () => (new Date()).toLocaleTimeString();

    // Create a DailyRotateFile transport for application logs
    const appTransport = new DailyRotateFile({
    filename: path.join(logDirectory, `app-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    format: combine(
        timestamp({ format: timestampFormat }),
        printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    )
    });

    // Create a transport for error logs
    const errorTransport = new DailyRotateFile({
    filename: path.join(logDirectory, `error-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error',  // Set level to error for error logs
    format: combine(
        timestamp({ format: timestampFormat }),
        errors({ stack: true }),  // Include stack traces for errors
        printf(info => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? '\n' + info.stack : ''}`)
    ),
    // Only create the error log file if there are error logs
    silent: true
    });

    // Create a logger instance
    const logger = createLogger({
    level: 'info',  // Set default level to info
    transports: [
        appTransport,
        errorTransport
    ]
    });
    return logger;
}

module.exports={
    getLogger
}
