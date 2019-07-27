const router = require('express').Router()
const eventsRoutes = require('./events')
const groupsRoutes = require('./groups')
const projectsRoutes = require('./projects')

// Book routes
router.use('/events', eventsRoutes)
router.use('/groups', groupsRoutes)
router.use('/projects', projectsRoutes)

module.exports = router
