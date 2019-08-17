const Op = require('sequelize').Op

const db = require('../models')
const userIsMemberOfGroup = require('../helpers').userIsMemberOfGroup

module.exports = {
  findAll: (req, res) => {
    let search = req.query.search
    let userId = parseInt(req.query.userId)
    let groupId = parseInt(req.query.groupId)
    let findQuery = {
      where: {}
    }
    if (search) {
      let words = search.split(/[\s,]+/)
      let queryList = []
      words.forEach(word => {
        let queryGroup = [
          { name: { [Op.substring]: word } },
          { description: { [Op.substring]: word } },
          { location: { [Op.substring]: word } },
          { about: { [Op.substring]: word } }
        ]
        queryList.push({ [Op.or]: queryGroup })
      })
      findQuery = {
        where: {
          [Op.and]: queryList
        }
      }
    }
    if ((userId || groupId) &&
      !req.isAuthenticated()) return res.status(401).end() // Unauthorized
    if (userId) {
      if (userId !== req.user.id) return res.status(403).end() // Forbidden
      findQuery.include = [{
        model: db.User,
        where: {
          id: userId
        }
      }]
    }
    if (groupId) findQuery.where.GroupId = groupId
    db.Project.findAll(findQuery)
      .then(data => res.json(data))
      .catch(error => {
        res.status(500).end()
        throw error
      })
  },
  findById: (req, res) => {
    db.Project.findOne({
      where: { id: req.params.id },
      include: [db.Event, db.User, {
      // include: [db.Event, {
        model: db.Group,
        include: [{
          model: db.Member,
          include: [db.User]
        }]
      }],
      order: [ [db.Event, 'start', 'DESC'] ]
    })
      .then(project => {
        if (!project) return res.status(404).end() // No project found
        res.json(project)
      })
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
        if (!project) return res.status(404).end() // No project found
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
        if (!project) return res.status(404).end() // No project found
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
