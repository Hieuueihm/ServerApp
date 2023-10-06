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
        type: Date,
        default: null,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        default: "other",
    },
    age: {
        type: Number,
        default: 10// Giá trị mặc định là 18
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
        type: String
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