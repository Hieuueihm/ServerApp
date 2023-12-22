const mongoose = require('mongoose')
const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    email:
    {
        type: String
    },
    message: {
        type: String,
        default: ""
    }
},
    {
        timestamps: true,
        collection: 'message'
    }
)
module.exports = mongoose.model("message", messageSchema);