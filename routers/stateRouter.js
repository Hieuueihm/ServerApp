const { Router } = require('express')
const router = Router()
const { handleGetStateData, handlePostStateData } = require('../controllers/state');
router.post('/postStateData', handlePostStateData)
router.get('/getStateData', handleGetStateData);
module.exports = router