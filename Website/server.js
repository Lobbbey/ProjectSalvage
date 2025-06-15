//Imports
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config()
const app = express();
app.use(cors());
app.use(bodyParser.json());

//Setting Up Database
const MongoClient = require('mongodb').MongoClient; 
const url = process.env.MONGODB_URI;

if (!url) {
    console.error("❌ MongoDB URI is missing. Set it in the .env file.");
    process.exit(1); // Exit if the DB URL is not found
}

const client = new MongoClient(url);

client.connect()
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit if the connection fails
    });

//Access Control Headers
app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});

//API calls
var api = require('./api.js');
api.setApp(app, client);

//Listening on port 5000
app.listen(5000);