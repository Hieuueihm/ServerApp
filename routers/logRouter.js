const { Router } = require('express')
const router = Router()
const { handleGetCurrentLog, handleSetCurrentLog, handleToggleCurrentLog } = require('../controllers/log');

router.get('/getCurrentLog', handleGetCurrentLog)
router.post('/setCurrentLog', handleSetCurrentLog)
router.get('/toggleCurrentLog', handleToggleCurrentLog)


module.exports = router