const mongoose = require('mongoose')
const logSchema = new mongoose.Schema({
    prevLog: {
        type: Boolean,
        default: false
    },
    currentLog: {
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