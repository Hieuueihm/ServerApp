const mongoose = require('mongoose');

const heartRateSchema = new mongoose.Schema({
    timestamp: {
        type: String,
        default: ""
    },
    value: {
        type: Number,
        default: 0
    }
}, { _id: false, timestamps: true });

const sleepSchema = new mongoose.Schema({
    // Define the structure for Giấc ngủ if needed
    // For example:
    startTime: {
        type: Date,
        default: null
    },
    endTime: {
        type: Date,
        default: null
    }
    // Add other relevant fields for sleep tracking
}, { _id: false });
const spo2Schema = new mongoose.Schema({
    timestamp: {
        type: String,
        default: ""
    },
    value: {
        type: Number,
        default: 0
    }
}, { _id: false, timestamps: true });

const daysSchema = new mongoose.Schema({
    day: {
        type: String,
        default: ""
    },
    step: {
        type: Number,
        default: 0
    },
    kcal: {
        type: Number,
        default: 0
    },
    heartRate: {
        avgHeartRate: [heartRateSchema],
        avgSpo2: [spo2Schema],
        currentHeartRate: {
            type: Number,
            default: 0
        },
        currentSpo2: {
            type: Number,
            default: 0
        }
    },
    sleep: sleepSchema
}, { _id: false });

// Main schema for the State collection
const stateSchema = new mongoose.Schema({
    objectId: {
        type: String,
        default: ""
    },
    days: [daysSchema], // Reference to Day collection
    airQuality: {
        co2: {
            type: Number,
            default: 0
        },
        no2: {
            type: Number,
            default: 0
        },
        timestamps: {
            type: String,
            default: ""
        }
    }
}, {
    timestamps: true,
    collection: 'state'

});

// Optionally, you can add timestamps to track document creation and modification

// Create and export the model for the State collection

module.exports = mongoose.model("state", stateSchema);
