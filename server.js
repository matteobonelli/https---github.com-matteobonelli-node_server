
const express = require('express');
const registroApp = express();
const { IsNotPippettoException, SavingException } = require('./Exceptions/Exceptions');
const { connectToMongo, getDatabaseInstance } = require('./db')

const { query, body, validationResult } = require('express-validator');
const { authorization, saveJwt, delay, saveLog, arrayToDate, info, errorLog } = require('./utilModule');

const database = getDatabaseInstance();

registroApp.use(express.json());

registroApp.get('/users'
, async (req, res) =>{
    try {
        const collection = database.collection('users');
        const users = await collection.find({}).toArray();
        res.json(users);
    } catch (error) {
        res.status(500).send("Error fetching users from database");
    }
    
});

registroApp.get('/log'
, async (req, res) =>{
    try {
        info("Get Log Called")
        await delay(5000)
        const requestData = req.query;
        console.log(requestData)
        info("Get Log successfull")
        return res.status(200).json({receivedData : requestData, pippo : "Pippetto"});
    } catch (error) {
        errorLog(error.message)
        res.status(500).send(error);
    }
    
});

registroApp.post('/propagateJWT'
, async (req, res) =>{
    try {
        authorization(req, res)
        saveJwt(req, database)
        res.status(200).send("OK")
    } catch (error) {
        if(error instanceof IsNotPippettoException){
            res.status(error.httpCode).json({ message: error.message });
        } else if(error instanceof SavingException){
            res.status(error.httpCode).json({ message: error.message });
        }
    }
    
});

registroApp.post('/saveLog'
, async (req, res) =>{
    try {
        info("Save Log to Db called")
        saveLog(req, database)
        res.status(200).send("OK")
        info("Save Log to DB Succesfull")
    } catch (error) {
        if(error instanceof IsNotPippettoException){
            res.status(error.httpCode).json({ message: error.message });
            errorLog(error.message)
        } else if(error instanceof SavingException){
            console.log(error.message)
            res.status(error.httpCode).json({ message: error.message });
            errorLog(error.message)
        }
    }
    
});

registroApp.get('/searchUsers', [
    query('name').notEmpty().withMessage('Name is required'),
    query('surname').notEmpty().withMessage('Surname is required')
]
, async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // Retrieve the values of the "name" and "surname" parameters from the query string
    const firstName = req.query.name;
    const lastName = req.query.surname;
    
    console.log(req.query);
    
    try {
        const collection = database.collection('users');
        const users = await collection.find({
            first_name: firstName,
            last_name: lastName
        }).toArray();
        res.json(users);
    } catch (error) {
        res.status(500).send("Error fetching users from database");
    }
});

registroApp.post('/users', [
    body('first_name').notEmpty().withMessage('First name is required'),
    body('last_name').notEmpty().withMessage('Last name is required'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { first_name, last_name } = req.body;
    try {
        const collection = database.collection('users');
        const result = await collection.insertOne({
            first_name,
            last_name,
        });
        
        res.json({ message: 'User created successfully', user: result.ops[0] });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Error creating user' });
    }
});

registroApp.listen(3000, () => {
    console.log("Pippetto is watching you....")
    connectToMongo();
});
