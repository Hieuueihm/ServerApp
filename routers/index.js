const { Router } = require('express')
const router = Router()
const userRouter = require('./userRouter');
const logRouter = require('./logRouter')
const stateRouter = require('./stateRouter')
const mapRouter = require('./mapRouter')
router.use('/user', userRouter)
router.use('/log', logRouter)
router.use('/state', stateRouter)
router.use('/map', mapRouter)



module.exports = router;