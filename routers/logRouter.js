const { Router } = require('express')
const router = Router()
const { handleGetCurrentLog, handleSetCurrentLog } = require('../controllers/log');

router.get('/getCurrentLog', handleGetCurrentLog)
router.post('/setCurrentLog', handleSetCurrentLog)


module.exports = router