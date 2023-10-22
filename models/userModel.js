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
    }
    ,
    reminderDay: {
        type: String,
        default: ''
    },
    reminderTime: {
        type: String,
        default: ''
    },
    captcha: {
        type: Number,
        default: null,
    }
},
    {
        timestamps: true,
        collection: 'users'
    }
)
module.exports = mongoose.model("users", userSchema);