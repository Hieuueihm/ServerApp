const { Router } = require('express')
const router = Router()
const { handleSaveSportHistory } = require('../controllers/map');


router.post('/postSportHistory', handleSaveSportHistory)


module.exports = router