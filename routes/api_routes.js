const _ = require('lodash')

const db = require('../models')

function userIsMemberOfGroup (user, group) {
  let users = group.Members.map(member => member.User)
  if (_.filter(users, { id: user.id }).length) {
    return true
  } else {
    return false
  }
}

module.exports = function (app) {
  function createReadOnlyRoutes (model, baseUrl, includeModels) {
    app.get(baseUrl, function (request, response) {
      let options = {}
      if (includeModels) options.include = includeModels
      model.findAll(options)
        .then(data => { response.json(data) })
        .catch(() => { response.status(500).end() })
    })
  }

  /*
  function createRoutes (model, baseUrl, includeModels) {
    createReadOnlyRoutes(model, baseUrl, includeModels)

    app.post(baseUrl, function (request, response) {
      model.create(request.body)
        .then(data => {
          response.json(data)
        })
        .catch(() => {
          response.status(500).end()
        })
    })

    app.put(`${baseUrl}`, function (request, response) {
      model.update(request.body, {
        where: {
          id: request.body.id
        }
      })
        .then(data => {
          response.json(data)
        })
        .catch(() => {
          response.status(500).end()
        })
    })

    app.delete(`${baseUrl}/:id`, function (request, response) {
      model.destroy({
        where: {
          id: request.params.id
        }
      })
        .then(() => {
          response.status(204).end()
        })
        .catch(() => {
          response.status(500).end()
        })
    })
  }
  */

  app.post('/api/groups', function (request, response) {
    if (!request.isAuthenticated()) {
      response.status(401).end() // Unauthorized
    } else {
      db.Group.create(request.body)
        .then(group => {
          db.Member.create({
            GroupId: group.id,
            UserId: request.user.id,
            isOwner: true
          })
            .then(() => { response.json(group) })
            .catch(() => { response.status(500).end() })
        })
        .catch(() => { response.status(500).end() })
    }
  })

  app.post('/api/projects', function (request, response) {
    if (!request.isAuthenticated()) {
      response.status(401).end() // Unauthorized
    } else {
      db.Group.findOne({
        where: { id: request.body.GroupId },
        include: [{
          model: db.Member,
          include: [db.User]
        }]
      })
        .catch(() => { response.status(500).end() })
        .then((group) => {
          if (userIsMemberOfGroup(request.user, group)) {
            db.Project.create(request.body)
              .then((project) => { response.json(project) })
              .catch(() => { response.status(500).end() })
          } else {
            response.status(403).end() // Forbidden
          }
        })
    }
  })

  app.put('/api/projects', function (request, response) {
    if (!request.isAuthenticated()) {
      response.status(401).end() // Unauthorized
    } else {
      db.Project.findOne({
        where: { id: request.body.id },
        include: [{
          model: db.Group,
          include: [{
            model: db.Member,
            include: [db.User]
          }]
        }]
      })
        .catch(() => { response.status(500).end() })
        .then(project => {
          if (userIsMemberOfGroup(request.user, project.Group)) {
            project.update(request.body)
              .then(() => { response.json(project) })
              .catch(() => { response.status(500).end() })
          } else {
            response.status(403).end() // Forbidden
          }
        })
    }
  })

  app.put('/api/follow/:id', function (request, response) {
    if (!request.isAuthenticated()) {
      response.status(401).end() // Unauthorized
    } else {
      db.Project.findOne({
        where: { id: request.params.id }
      })
        .catch(() => { response.status(500).end() })
        .then(project => {
          db.User.findOne({
            where: { id: request.user.id }
          })
            .catch(() => { response.status(500).end() })
            .then(user => {
              if (request.query.unfollow) {
                user.removeProject(project)
              } else {
                user.addProject(project)
              }
              response.json(project)
            })
        })
    }
  })

  createReadOnlyRoutes(db.Project, '/api/projects')
}

module.exports.userIsMemberOfGroup = userIsMemberOfGroup
