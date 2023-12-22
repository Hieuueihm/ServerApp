const mongoose = require('mongoose')
const logSchema = new mongoose.Schema({
    logout: {
        type: Boolean,
        default: false
    },
    login: {
        type: Boolean,
        default: false

    },
    objectId: {
        type: String,
        default: ""
    }
},
    {
        timestamps: true,
        collection: 'log'
    }
)
module.exports = mongoose.model("log", logSchema);