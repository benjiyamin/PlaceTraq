const db = require('../models')
// const userIsMemberOfGroup = require('../helpers').userIsMemberOfGroup

module.exports = {
  findAll: (req, res) => {
    return true
  },
  findById: (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).end() // Unauthorized
    if (req.user.id.toString() !== req.params.id) return res.status(403).end() // Forbidden
    db.User.findOne({
      where: { id: req.params.id },
      include: [
      /* {
        model: db.Project,
        include: [{
          model: db.Event,
          include: [db.Project]
        }],
        order: [ [db.Event, 'start', 'DESC'] ]
      }, */
        {
          model: db.Member,
          include: [{
            model: db.Group,
            include: [db.Member]
          }]
        }]
    })
      .then(user => {
        if (!user) return res.status(404).end() // No user found
        res.json(user)
      })
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  create: (req, res) => {
    return true
  },
  update: (req, res) => {
    return true
  },
  remove: (req, res) => {
    return true
  }
}
