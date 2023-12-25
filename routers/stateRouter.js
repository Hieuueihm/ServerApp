const { Router } = require('express')
const router = Router()
const { handleGetStateData, handlePostStateData, handleGetAllStateData, handleGetWeeklyTimeSleep } = require('../controllers/state');
router.post('/postStateData', handlePostStateData)
router.get('/getStateData', handleGetStateData);
router.get('/getAllStateData', handleGetAllStateData)
router.post('/getWeeklyTimeSleep', handleGetWeeklyTimeSleep)
module.exports = router

