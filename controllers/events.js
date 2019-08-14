const Op = require('sequelize').Op

const db = require('../models')
const userIsMemberOfGroup = require('../helpers').userIsMemberOfGroup

module.exports = {
  findAll: (req, res) => {
    let userId = parseInt(req.query.userId)
    let findQuery = {}
    if (userId) {
      if (!req.isAuthenticated()) return res.status(401).end() // Unauthorized
      if (userId !== req.user.id) return res.status(403).end() // Forbidden
      findQuery = {
        include: [{
          model: db.Project,
          include: [{
            model: db.User,
            [Op.contains]: { id: userId }
          }]
        }]
      }
    }
    db.Event.findAll(findQuery)
      .then(events => events.filter(event => {
        return event.Project.Users.filter(user => user.id === userId).length
      }))
      .then(data => res.json(data))
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  findById: (req, res) => {
    db.Event.findOne({
      where: { id: req.params.id }
    })
      .then(event => {
        if (!event) return res.status(404).end() // No event found
        res.json(event)
      })
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  create: (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).end() // Unauthorized
    db.Project.findOne({
      where: { id: req.body.ProjectId },
      include: [{
        model: db.Group,
        include: [{
          model: db.Member,
          include: [db.User]
        }]
      }]
    })
      .then(project => {
        if (!userIsMemberOfGroup(req.user, project.Group)) return res.status(403).end() // Forbidden
        return db.Event.create(req.body)
      })
      .then(event => res.json(event))
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  update: (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).end() // Unauthorized
    if (!event) return res.status(404).end() // No event found
    db.Event.findOne({
      where: { id: req.body.id },
      include: [{
        model: db.Project,
        include: [{
          model: db.Group,
          include: [{
            model: db.Member,
            include: [db.User]
          }]
        }]
      }]
    })
      .then(event => {
        if (!userIsMemberOfGroup(req.user, event.Project.Group)) return res.status(403).end() // Forbidden
        return event.update(req.body)
      })
      .then(event => res.json(event))
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  remove: (req, res) => {
    return true
  }
}
