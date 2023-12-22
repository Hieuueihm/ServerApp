const { Router } = require('express')
const router = Router()
const { handleGetStateData, handlePostStateData, handleGetAllStateData } = require('../controllers/state');
router.post('/postStateData', handlePostStateData)
router.get('/getStateData', handleGetStateData);
router.get('/getAllStateData', handleGetAllStateData)
module.exports = router

