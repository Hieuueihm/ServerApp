const mongoose = require('mongoose');
require('dotenv').config();

const DATABASE_URI = process.env.DATABASE_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE_URI);

        console.log("Connected to MongoDB!");

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

module.exports = connectDB;