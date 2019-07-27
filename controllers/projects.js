const db = require('../models')
const userIsMemberOfGroup = require('../helpers/helpers').userIsMemberOfGroup

module.exports = {
  findAll: (req, res) => {
    db.Project.findAll()
      .then(data => res.json(data))
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  findById: (req, res) => {
    db.Project.findOne({
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
    db.Group.findOne({
      where: { id: req.body.GroupId },
      include: [{
        model: db.Member,
        include: [db.User]
      }]
    })
      .then(group => {
        if (!userIsMemberOfGroup(req.user, group)) return res.status(403).end() // Forbidden
        return db.Project.create(req.body)
      })
      .then(project => res.json(project))
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  update: (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).end() // Unauthorized
    db.Project.findOne({
      where: { id: req.body.id },
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
        return project.update(req.body)
      })
      .then(project => res.json(project))
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  remove: (req, res) => {
    return true
  },
  follow: (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).end() // Unauthorized
    db.Project.findOne({
      where: { id: req.params.id }
    })
      .then(project => {
        return db.User.findOne({
          where: { id: req.user.id }
        })
          .then(user => {
            req.query.unfollow ? user.removeProject(project) : user.addProject(project)
            res.json(project)
          })
      })
      .catch(error => {
        res.status(500).end()
        throw error
      })
  }
}
