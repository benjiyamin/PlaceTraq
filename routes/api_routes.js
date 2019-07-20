const db = require('../models')
const userIsMemberOfGroup = require('../helpers/helpers').userIsMemberOfGroup

module.exports = function (app) {
  function createReadOnlyRoutes (model, baseUrl, includeModels) {
    app.get(baseUrl, function (req, res) {
      let options = {}
      if (includeModels) options.include = includeModels
      model.findAll(options)
        .then(data => res.json(data))
        .catch(error => {
          res.status(500).end()
          throw error
        })
    })

    app.get(`${baseUrl}/:id`, function (req, res) {
      let options = {
        where: { id: req.params.id }
      }
      if (includeModels) options.include = includeModels
      model.findOne(options)
        .then(data => res.json(data))
        .catch(error => {
          res.status(500).end()
          throw error
        })
    })
  }

  /*
  function createRoutes (model, baseUrl, includeModels) {
    createReadOnlyRoutes(model, baseUrl, includeModels)

    app.post(baseUrl, function (req, res) {
      model.create(req.body)
        .then(data => {
          res.json(data)
        })
        .catch(() => {
          res.status(500).end()
        })
    })

    app.put(`${baseUrl}`, function (req, res) {
      model.update(req.body, {
        where: {
          id: req.body.id
        }
      })
        .then(data => {
          res.json(data)
        })
        .catch(() => {
          res.status(500).end()
        })
    })

    app.delete(`${baseUrl}/:id`, function (req, res) {
      model.destroy({
        where: {
          id: req.params.id
        }
      })
        .then(() => {
          res.status(204).end()
        })
        .catch(() => {
          res.status(500).end()
        })
    })
  }
  */

  app.post('/api/groups', function (req, res) {
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
  })

  app.put('/api/groups', function (req, res) {
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
        return group.update(req.body)
      })
      .then(group => res.json(group))
      .catch(error => {
        res.status(500).end()
        throw error
      })
  })

  app.post('/api/projects', function (req, res) {
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
  })

  app.put('/api/projects', function (req, res) {
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
  })

  app.put('/api/follow/:id', function (req, res) {
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
  })

  app.post('/api/events', function (req, res) {
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
  })

  app.put('/api/events', function (req, res) {
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
  })

  createReadOnlyRoutes(db.Project, '/api/projects')
  createReadOnlyRoutes(db.Event, '/api/events')
}
