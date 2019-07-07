const db = require('../models')

module.exports = function (app) {
  function createReadOnlyRoutes (model, baseUrl, includeModels) {
    app.get(baseUrl, function (request, response) {
      let options = {}
      if (includeModels) options.include = includeModels
      model.findAll(options)
        .then(data => {
          response.json(data)
        })
        .catch(() => {
          response.status(500).end()
        })
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

  app.put('/api/follow', function (request, response) {
    /* eslint eqeqeq:0 */
    if (request.isAuthenticated() && request.user.id == request.query.user_id) {
      db.Project.findOne({
        where: {
          id: request.query.project_id
        }
      })
        .then(project => {
          db.User.findOne({
            where: {
              id: request.query.user_id
            }
          })
            .then(user => {
              if (request.query.value) {
                user.addProject(project)
              } else {
                user.removeProject(project)
              }
              response.json(user)
            })
        })
    } else {
      response.status(403).end()
    }
  })

  createReadOnlyRoutes(db.Project, '/api/projects', [db.User])
  createReadOnlyRoutes(db.User, '/api/users', [{
    model: db.Project,
    include: [db.Event]
  }])
}
