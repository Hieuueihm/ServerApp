const { Router } = require('express')
const router = Router()
const { getCaptcha, handleLogin, handleLoginWithFacebook, handleEditInformation, handleGetInformation } = require('../controllers/user');
const upload = require('../middlewares/upload')

router.post('/getcaptcha', getCaptcha)
router.post('/login', handleLogin)
router.post('/loginfacebook', handleLoginWithFacebook)
router.post('/editInformation', upload.single('avatar'), handleEditInformation)
router.post('/getInformation', handleGetInformation)

module.exports = router