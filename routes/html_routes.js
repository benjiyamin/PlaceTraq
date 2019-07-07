const _ = require('lodash')
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter

const db = require('../models')

module.exports = function (app) {
  app.get('/', function (request, response) {
    response.render('index', {})
  })

  app.get('/users/:id', function (request, response) {
    db.User.findOne({
      where: {
        id: request.params.id
      },
      include: [{
        model: db.Project,
        include: [db.Event],
        order: [
          [db.Event, 'datetime', 'DESC']
        ]
      }]
    }).then(function (user) {
      let events = []
      user.Projects.forEach(project => {
        project.Events.forEach(event => {
          event.project = project
          events.push(event)
        })
      })
      events = _.sortBy(events, ['datetime']).reverse()
      response.render('user', {
        user: user,
        events: events
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
      var deltaOps = project.about.ops
      var cfg = {}
      var converter = new QuillDeltaToHtmlConverter(deltaOps, cfg)
      var aboutHtml = converter.convert()

      response.render('project', {
        project: project,
        aboutHtml: aboutHtml
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
