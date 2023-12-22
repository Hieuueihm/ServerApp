const app = require('./app');
const cron = require('node-cron');
const sendAllUserNotification = require('./utils/notifications')

require('dotenv').config()




const connectDB = require('./configs/db')
const mongoose = require('mongoose')

app.listen(process.env.PORT || 3001, () => {
    console.log("ADHFit API listenint on localhost:", process.env.PORT || 3001);
})



connectDB()
cron.schedule('0 6,12,18 * * *', () => {
    sendAllUserNotification()
}
)

// sendAllUserNotification()