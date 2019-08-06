const router = require('express').Router()
const eventsRoutes = require('./events')
const groupsRoutes = require('./groups')
const projectsRoutes = require('./projects')
const usersRoutes = require('./users')

// Book routes
router.use('/events', eventsRoutes)
router.use('/groups', groupsRoutes)
router.use('/projects', projectsRoutes)
router.use('/users', usersRoutes)

module.exports = router
