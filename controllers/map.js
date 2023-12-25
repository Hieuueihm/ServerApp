const Map = require('../models/mapModel')
const User = require('../models/userModel.js')

const handleSaveSportHistory = async (req, res) => {
    try {
        const { objectId, timeStart, timeEnd, latitude, longitude, timestamp } = req.body
        const existingObject = await Map.findOne({ objectId });

        if (existingObject) {
            // Object with the given objectId already exists, add a new sportHistory
            console.log('check')
            existingObject.historySport.push({
                timeStart: timeStart,
                timeEnd: timeEnd,
                latitude: latitude,
                longitude: longitude,
                timestamp: timestamp
            });
            await existingObject.save()
        } else {
            const sportHistory = {
                timeStart: timeStart,
                timeEnd: timeEnd,
                latitude: latitude,
                longitude: longitude,
                timestamp: timestamp
            };
            const newMapObject = new Map({
                objectId: objectId,
                historySport: [sportHistory],
            });

            // Save the new map object to the database
            await newMapObject.save();
        }

        return res.status(200).json({ success: true })
    } catch (error) {
        console.error('Error handle save sport history log:', error);
        return res.status(400).json({ success: false })
    }
}
const handleGetAllSportHistory = async (req, res) => {
    try {
        const { objectId } = req.body
        const existingObject = await Map.findOne({ objectId });

        if (existingObject) {
            // Object with the given objectId exists, return its historySport
            const historySport = existingObject.historySport;
            res.status(200).json({ success: true, historySport });
        } else {
            // Object with the given objectId doesn't exist
            res.status(404).json({ success: false, error: 'Object not found' });
        }
    } catch (error) {
        console.error('Error handle get all sport history:', error);
        return res.status(400).json({ success: false })
    }
}
module.exports = {
    handleSaveSportHistory,
    handleGetAllSportHistory
}