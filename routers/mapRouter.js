const { Router } = require('express')
const router = Router()
const { handleSaveSportHistory, handleGetAllSportHistory } = require('../controllers/map');


router.post('/postSportHistory', handleSaveSportHistory)
router.post('/getAllSportHistory', handleGetAllSportHistory)


module.exports = router