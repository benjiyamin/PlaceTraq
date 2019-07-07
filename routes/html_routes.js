const db = require('../models')

module.exports = function (app) {
  app.get('/', function (request, response) {
    response.render('index', {})
  })

  app.get('/users/:id', function (request, response) {
    db.user.findOne({
      where: {
        id: request.params.id
      },
      include: [{
        model: db.project,
        include: [db.event],
        order: [
          [db.event, 'datetime', 'DESC']
        ]
      }]
    }).then(function (user) {
      // Need to fix this to actually combine event data in order
      let events = []
      user.projects.forEach(project => {
        project.events.forEach(event => {
          events.push(event)
        })
      })
      response.render('user', {
        user: user,
        events: events
      })
    })
  })

  app.get('/projects/:id', function (request, response) {
    db.project.findOne({
      where: {
        id: request.params.id
      },
      include: [db.event, db.user],
      order: [
        [db.event, 'datetime', 'DESC']
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
