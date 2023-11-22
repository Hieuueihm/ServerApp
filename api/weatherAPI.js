const axios = require('axios')
require("dotenv").config()
const forecastEndpoint = () =>
    `https://api.weatherapi.com/v1/forecast.json?key=${process.env.weatherAPIKey} &q=Hanoi&days=2&aqi=no&alerts=no`;

const apiCall = async (endpoint) => {
    const options = {
        method: 'GET',
        url: endpoint
    }

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

const fetchWeatherForecast = () => {
    let forecastUrl = forecastEndpoint();
    return apiCall(forecastUrl)
}

module.exports = fetchWeatherForecast