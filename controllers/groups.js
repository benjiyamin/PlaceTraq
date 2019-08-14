const db = require('../models')
const userIsMemberOfGroup = require('../helpers').userIsMemberOfGroup

module.exports = {
  findAll: (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).end() // Unauthorized
    db.Group.findAll({
      include: [{
        model: db.Member,
        where: {
          UserId: req.user.id
        }
      }]
    })
      .then(data => res.json(data))
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  findById: (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).end() // Unauthorized
    db.Group.findOne({
      where: { id: req.params.id },
      include: [db.Project, {
        model: db.Member,
        include: [db.User, db.Group]
      }],
      order: [ [db.Member, 'isOwner', 'ASC'] ]
    })
      .then(group => {
        if (!userIsMemberOfGroup(req.user, group)) return res.status(403).end() // Forbidden
        if (!group) return res.status(404).end() // No group found
        res.json(group).end()
      })
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  create: (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).end() // Unauthorized
    db.Group.create(req.body)
      .then(group => {
        return db.Member.create({
          GroupId: group.id,
          UserId: req.user.id,
          isOwner: true
        })
      })
      .then(member => res.json(member))
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  update: (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).end() // Unauthorized
    db.Group.findOne({
      where: { id: req.body.id },
      include: [{
        model: db.Member,
        include: [db.User]
      }]
    })
      .then(group => {
        if (!userIsMemberOfGroup(req.user, group)) return res.status(403).end() // Forbidden
        if (!group) return res.status(404).end() // No group found
        return group.update(req.body)
      })
      .then(group => res.json(group))
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  remove: (req, res) => {
    return true
  }
}
