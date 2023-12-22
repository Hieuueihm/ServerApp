const { Double } = require('mongodb');
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true, // Đảm bảo email là duy nhất
    },
    name: {
        type: String,
        default: ""
    },
    dateOfBirth: {
        type: String,
        default: null,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        default: "Other",
    },
    height: {
        type: Number,
        default: 0,
    },
    weight: {
        type: Number,
        default: 0,
    },
    kcalRate: {
        type: Number,
        default: 1
    },
    distanceFootRate: {
        type: Number,
        default: 1
    },
    avatar: {
        type: String,
        default: ''
    },
    isNewUser: {
        type: Boolean,
        default: true
    },
    targetStep: {
        type: Number,
        default: 0
    },
    targetKcal: {
        type: Number,
        default: 0
    }
    ,
    reminderDay: {
        type: [String],
        default: []
    },
    isReminder: {
        type: Boolean,
        default: false
    }
    ,
    dailyStartTime: {
        type: String,
        default: ''
    }
    ,
    reminderTime: {
        type: String,
        default: ''
    },
    timeScheduleCreated:
    {
        type: String,
        default: null
    },
    captcha: {
        type: Number,
        default: null,
    },
    fcmtoken: {
        type: String,
        default: ''
    },
    isReceiveNotification: {
        type: Boolean,
        default: false
    },
    hasTrainingSchedule: {
        type: Boolean,
        default: false
    },
    targetCompleted: {
        type: Number,
        default: 0
    },
    timestampUpdated: {
        type: String,
        default: null
    }
},
    {
        timestamps: true,
        collection: 'users'
    }
)
module.exports = mongoose.model("users", userSchema);