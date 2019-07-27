const router = require('express').Router()
const apiRoutes = require('./api')
const authRoutes = require('./auth')

// API Routes
router.use('/api', apiRoutes)
router.use('/', authRoutes)

module.exports = router
