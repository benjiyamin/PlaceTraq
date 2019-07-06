var db = require('../models')

module.exports = function (app) {
  app.get('/', function (request, response) {
    response.render('index', {})
  })

  app.get('/projects/:id', function (request, response) {
    db.Project.findOne({
      where: {
        id: request.params.id
      },
      include: [db.Event],
      order: [
        [db.Event, 'datetime', 'DESC']
      ]
    }).then(function (project) {
      response.render('project', {
        project: project
      })
    })
  })

  app.get('/signup', function (request, response) {
    response.render('login', {
      signUp: true
    })
  })

  app.get('/login', function (request, response) {
    response.render('login', {})
  })
}
