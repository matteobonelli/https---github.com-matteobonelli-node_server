const jwt = require('jsonwebtoken');
const { IsNotPippettoException, SavingException } = require('./Exceptions/Exceptions');

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
        const jwtToken = req.body;
        const decoded = jwt.decode(jwtToken);
        decoded.jwt = jwtToken;
        console.log(decoded)
        database.collection('jwt').insertOne(decoded);
    } catch (error) {
        throw new SavingException();
    }
     
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports={
    authorization,
    saveJwt,
    delay
}