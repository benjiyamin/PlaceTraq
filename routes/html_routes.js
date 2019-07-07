var db = require('../models')

module.exports = function (app) {
  app.get('/', function (request, response) {
    response.render('index', {})
  })

  app.get('/users/:id', function (request, response) {
    db.User.findOne({
      where: {
        id: request.params.id
      },
      include: {
        model: db.Project,
        include: [db.Event]
      },
      order: [
        [db.Event, 'datetime', 'DESC']
      ]
    }).then(function (user) {
      response.render('user', {
        user: user
      })
    })
  })

  app.get('/projects/:id', function (request, response) {
    db.Project.findOne({
      where: {
        id: request.params.id
      },
      include: [db.Event, db.User],
      order: [
        [db.Event, 'datetime', 'DESC']
      ]
    }).then(function (project) {
      // console.log(request.user)
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
