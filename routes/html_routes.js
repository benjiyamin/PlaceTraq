const Op = require('sequelize').Op

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
      let deltaOps = project.about.ops
      let cfg = {}
      let converter = new QuillDeltaToHtmlConverter(deltaOps, cfg)
      let aboutHtml = converter.convert()
      let context = {
        project: project,
        aboutHtml: aboutHtml
      }
      if (request.query.edit && request.isAuthenticated()) { // Change later to provide authentication with the request.user
        context.edit = true
      }
      response.render('project', context)
    })
  })

  app.get('/projects', function (request, response) {
    let search = request.query.search
    let findQuery = {}
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
    db.Project.findAll(findQuery).then(function (projects) {
      let context = { projects: projects }
      if (search) {
        context.search = search
      }
      response.render('projects', context)
    })
  })

  app.get('/signup', function (request, response) {
    let context = { signUp: true }
    if (request.query.redirect) {
      context.redirect = request.query.redirect
    }
    response.render('login', context)
  })

  app.get('/login', function (request, response) {
    let context = {}
    if (request.query.redirect) {
      context.redirect = request.query.redirect
    }
    response.render('login', context)
  })
}
