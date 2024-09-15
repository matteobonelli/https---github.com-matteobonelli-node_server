const jwt = require('jsonwebtoken');
const { IsNotPippettoException, SavingException } = require('./Exceptions/Exceptions');
const fs = require('fs');
const path = require('path');
const { format } = require('util');

const logDirectory = 'C:\\Users\\bonel\\Desktop\\logs';

function authorization(req, res){
    const authHeader = req.headers.authorization;
        
        // Log all headers for debugging
        console.log('Incoming Headers:', req.headers);

        if (!authHeader || !authHeader.startsWith('Basic ')) {
            throw new IsNotPippettoException();
        }

        const base64Credentials = authHeader.split(' ')[1];
        const decodedCredentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [username, password] = decodedCredentials.split(':');
        
        console.log('Basic Auth Credentials:', { username, password });
        
        if (username !== 'pippetto' || password !== 'franchino') {
            throw new IsNotPippettoException();
        } 
}

function saveJwt(req, database){
    try {
        const jwtToken = req.body.jwt;
        const decoded = jwt.decode(jwtToken);
        decoded.jwt = jwtToken;
        console.log(decoded)
        database.collection('jwt').insertOne(decoded);
    } catch (error) {
        throw new SavingException();
    }
    
}

function saveLog(req, database){
    try {
        const logData = req.body;
        const parsedStartDate = arrayToDate(logData.startDate)
        const parsedEndDate = arrayToDate(logData.endDate)
        logData.startDate = parsedStartDate
        logData.endDate = parsedEndDate
        console.log(logData)
        database.collection('logs').insertOne(logData);
    } catch (error) {
        errorLog(error.message)
        throw new SavingException();
    }
     
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function arrayToDate(arr) {
    try{
        return new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5], Math.floor(arr[6] / 1000000)));
    } catch (error) {
        errorLog(error.message)
    }
    
}

function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getCurrentDateTimeInItalianTime() {
    const now = new Date();
    const offset = 2; // CEST is UTC+2

    // Calculate the current time in UTC+2 (Italian Time during summer)
    const italianTime = new Date(now.getTime() + (offset * 60 * 60 * 1000));

    const year = italianTime.getUTCFullYear();
    const month = String(italianTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(italianTime.getUTCDate()).padStart(2, '0');
    const hours = String(italianTime.getUTCHours()).padStart(2, '0');
    const minutes = String(italianTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(italianTime.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(italianTime.getUTCMilliseconds()).padStart(3, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function appendToFile(filename, data) {
    try{
        const logPath = path.join(logDirectory, getCurrentDate() + '_' + filename + '.log');
        const logMessage = format('%s - %s\n', getCurrentDateTimeInItalianTime().toString(), data);
        fs.appendFileSync(logPath, logMessage);
    } catch (error){
        errorLog(error.message)
    }
    
}

function info(message) {
    try {
        appendToFile('app_node', `INFO ${message}`);
    } catch(error){
        errorLog(error.message)
    }
    
}
   
function errorLog(message) {
    try{
        appendToFile('error_node', `ERROR ${message}`);
    } catch(error){
        console.log(error)
    }
}


module.exports={
    authorization,
    saveJwt,
    delay,
    saveLog,
    arrayToDate,
    info,
    errorLog
}