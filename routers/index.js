const { Router } = require('express')
const router = Router()
const userRouter = require('./userRouter');
const logRouter = require('./logRouter')
const stateRouter = require('./stateRouter')
router.use('/user', userRouter)
router.use('/log', logRouter)
router.use('/state', stateRouter)



module.exports = router;