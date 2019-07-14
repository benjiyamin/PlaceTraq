const db = require('../models')
const userIsMemberOfGroup = require('../helpers/helpers').userIsMemberOfGroup

module.exports = function (app) {
  function createReadOnlyRoutes (model, baseUrl, includeModels) {
    app.get(baseUrl, function (req, res) {
      let options = {}
      if (includeModels) options.include = includeModels
      model.findAll(options)
        .then(data => res.json(data))
        .catch(() => res.status(500).end())
    })

    app.get(`${baseUrl}/:id`, function (req, res) {
      let options = {
        where: { id: req.params.id }
      }
      if (includeModels) options.include = includeModels
      model.findOne(options)
        .then(data => res.json(data))
        .catch(() => res.status(500).end())
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
        db.Member.create({
          GroupId: group.id,
          UserId: req.user.id,
          isOwner: true
        })
          .then(() => res.json(group))
          .catch(() => res.status(500).end())
      })
      .catch(() => res.status(500).end())
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
      .catch(() => res.status(500).end())
      .then(group => {
        if (!userIsMemberOfGroup(req.user, group)) return res.status(403).end() // Forbidden
        group.update(req.body)
          .then(() => res.json(group))
          .catch(() => res.status(500).end())
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
      .catch(() => res.status(500).end())
      .then(group => {
        if (!userIsMemberOfGroup(req.user, group)) return res.status(403).end() // Forbidden
        db.Project.create(req.body)
          .then(project => res.json(project))
          .catch(() => res.status(500).end())
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
      .catch(() => res.status(500).end())
      .then(project => {
        if (!userIsMemberOfGroup(req.user, project.Group)) return res.status(403).end() // Forbidden
        project.update(req.body)
          .then(() => res.json(project))
          .catch(() => res.status(500).end())
      })
  })

  app.put('/api/follow/:id', function (req, res) {
    if (!req.isAuthenticated()) return res.status(401).end() // Unauthorized
    db.Project.findOne({
      where: { id: req.params.id }
    })
      .catch(() => res.status(500).end())
      .then(project => {
        db.User.findOne({
          where: { id: req.user.id }
        })
          .catch(() => res.status(500).end())
          .then(user => {
            req.query.unfollow ? user.removeProject(project) : user.addProject(project)
            res.json(project)
          })
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
      .catch(() => res.status(500).end())
      .then(project => {
        if (!userIsMemberOfGroup(req.user, project.Group)) return res.status(403).end() // Forbidden
        db.Event.create(req.body)
          .then(event => res.json(event))
          .catch(() => res.status(500).end())
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
      .catch(() => res.status(500).end())
      .then(event => {
        if (!userIsMemberOfGroup(req.user, event.Project.Group)) return res.status(403).end() // Forbidden
        event.update(req.body)
          .then(() => res.json(event))
          .catch(() => res.status(500).end())
      })
  })

  createReadOnlyRoutes(db.Project, '/api/projects')
  createReadOnlyRoutes(db.Event, '/api/events')
}
