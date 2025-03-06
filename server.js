const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
//require('dotenv').config()
//const url = process.env.MONODB_URI;
const url = 'mongodb+srv://kentaf1202:Lihys2G76A1hS6Ld@salvagefinancialdb.pvcx6.mongodb.net/SalvageFinancialDB?retryWrites=true&w=majority';
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers',
				  'Origin, X-requested-With, Content-Type, Accept, Authorization');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PATCH, DELETE, OPTIONS');
	next();
});

var api = require('./api.js');
api.setApp(app, client);

app.listen(5000);