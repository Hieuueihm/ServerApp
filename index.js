const app = require('./app');
require('dotenv').config()

const connectDB = require('./configs/db')
const mongoose = require('mongoose')

app.listen(process.env.PORT || 3001, () => {
    console.log("ADHFit API listenint on localhost:", process.env.PORT || 3001);
})

connectDB()

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});
