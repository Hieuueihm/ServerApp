const Map = require('../models/mapModel')
const User = require('../models/userModel.js')

const handleSaveSportHistory = async (req, res) => {
    try {
        const { objectId, timeStart, timeEnd, latitude, longitude } = req.body
        const sportHistory = {
            timeStart: timeStart,
            timeEnd: timeEnd,
            latitude: latitude,
            longitude: longitude,
        };
        const newMapObject = new Map({
            objectId: objectId,
            historySport: [sportHistory],
        });

        // Save the new map object to the database
        await newMapObject.save();
        return res.status(200).json({ success: true })
    } catch (error) {
        console.error('Error handle save sport history log:', error);
        return res.status(400).json({ success: false })
    }
}
module.exports = {
    handleSaveSportHistory
}