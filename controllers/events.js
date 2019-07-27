const db = require('../models')
const userIsMemberOfGroup = require('../helpers/helpers').userIsMemberOfGroup

module.exports = {
  findAll: (req, res) => {
    db.Event.findAll()
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
      .then(data => res.json(data))
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
