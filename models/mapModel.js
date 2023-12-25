const mongoose = require('mongoose')
const historySportSchema = new mongoose.Schema({
    timeStart: {
        type: String
    },
    timeEnd: {
        type: String
    },
    latitude: {
        type: [Number]
    },
    longitude: {
        type: [Number]
    },
    timestamp: {
        type: [Number]
    }
}, { timestamps: true })
const mapSchema = new mongoose.Schema({
    objectId: {
        type: String,
        default: ""
    },
    historySport: [historySportSchema]
},
    {
        timestamps: true,
        collection: 'map'
    }
)
module.exports = mongoose.model("map", mapSchema);