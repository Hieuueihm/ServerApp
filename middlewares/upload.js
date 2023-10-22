const path = require('path')
const multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        if (
            file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg"
        ) {
            callback(null, true);
        }
        else {
            console.log("only jpg, jpeg, png file supported")
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }

})

module.exports = upload
