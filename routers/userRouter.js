const { Router } = require('express')
const router = Router()
const { getCaptcha, handleLogin, handleLoginWithFacebook, handleLoginWithGithub } = require('../controllers/user');

router.post('/getcaptcha', getCaptcha)
router.post('/login', handleLogin)
router.post('/loginfacebook', handleLoginWithFacebook)
router.post('/logingithub', handleLoginWithGithub)

module.exports = router