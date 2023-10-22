const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const router = require('./routers/index.js')


app.use(bodyParser.json())



// settings

// app.use(express.json())
app.use(cors({ origin: true, credentials: true }));
app.use('/uploads', express.static('uploads'));

// app.use(function (req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
// middlewares

// routes

app.use('/api', router)

//static files

module.exports = app
