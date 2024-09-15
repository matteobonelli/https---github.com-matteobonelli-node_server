
const { MongoClient } = require('mongodb');

const mongoUri = "mongodb://127.0.0.1:27017";

const client = new MongoClient(mongoUri);
const dbName = 'registro';
async function connectToMongo(){
    try {
        await client.connect()
        console.log('Pippetto is connected to Mongo...');
    } catch (error) {
        console.error("Pippetto is having troubles connecting...", error)
    }
}

function getDatabaseInstance(){
    const database = client.db(dbName);
    return database;
}

module.exports = {
    connectToMongo,
    getDatabaseInstance
}