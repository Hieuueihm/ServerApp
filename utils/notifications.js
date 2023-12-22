const admin = require('firebase-admin');
const serviceAccount = require('./service_account.json');
const User = require('../models/userModel')
const fetchWeatherForecast = require('../api/weatherAPI');
const { response } = require('../app');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const sendAllUserNotification = async () => {
    let resultWeather;
    fetchWeatherForecast()
        .then(response => {
            resultWeather = response
        })

    try {
        const users = await User.find({}); // Lấy toàn bộ tài khoản người dùng.
        users.forEach(user => {
            if (user.fcmtoken && user.isReceiveNotification == true) {
                sendNotification(user.fcmtoken, resultWeather);

            }
        });

    } catch (error) {
        console.error('Lỗi khi lấy FCM tokens:', error);
        throw error;
    }
};
const notificationContent = (resultWeather) => {
    return `
Nhiệt độ hiện tại là ${resultWeather?.current?.temp_c}
Khả năng mưa sắp tới là ${resultWeather?.forecast?.forecastday[0]?.hour[0]?.chance_of_rain} %
    `
}
const sendNotification = async (token, resultWeather) => {

    admin.messaging().send({
        notification: {
            title: 'ADHFit Weather Notification',
            body: notificationContent(resultWeather),
            imageUrl: 'https://my-cdn.com/app-logo.png',
        },
        token: token
    })
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
}

module.exports = sendAllUserNotification;