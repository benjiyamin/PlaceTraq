const Op = require('sequelize').Op

const moment = require('moment')
const _ = require('lodash')
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter

const db = require('../models')
const userIsMemberOfGroup = require('../helpers/helpers').userIsMemberOfGroup

module.exports = function (app) {
  app.get('/', function (request, response) {
    response.render('index', {})
  })

  app.get('/groups/:id', function (request, response) {
    if (!request.isAuthenticated()) { // User not logged in
      response.redirect('/login')
    } else {
      db.Group.findOne({
        where: { id: request.params.id },
        include: [db.Project, {
          model: db.Member,
          include: [db.User, db.Group]
        }],
        order: [ [db.Member, 'isOwner', 'ASC'] ]
      }).then(function (group) {
        if (userIsMemberOfGroup(request.user, group)) { // Request user is a member of the group. Authorized to edit page
          response.render('group', {
            group: group
          })
        } else { // User logged in, but trying to access a group page in which they are not a member.
          response.redirect('/')
        }
      })
    }
  })

  app.get('/users/:id', function (request, response) {
    if (!request.isAuthenticated()) { // User not logged in
      response.redirect('/login')
    } else if (request.user.id.toString() !== request.params.id) { // User logged in, but trying to access another user's page
      response.redirect('/')
    } else { // Authenticated and authorized to load user page
      db.User.findOne({
        where: { id: request.params.id },
        include: [{
          model: db.Project,
          include: [{
            model: db.Event,
            include: [db.Project]
          }],
          order: [ [db.Event, 'start', 'DESC'] ]
        }, {
          model: db.Member,
          include: [{
            model: db.Group,
            include: [db.Member]
          }]
        }]
      }).then(function (user) {
        let events = []
        user.Projects.forEach(project => {
          project.Events.forEach(event => {
            events.push(event)
          })
        })
        events = _.sortBy(events, ['start']).reverse()
        let pastEvents = events.filter(evt => (moment().diff(evt.start) > 0))
        let futureEvents = events.filter(evt => (moment().diff(evt.start) < 0))
        response.render('user', {
          user: user,
          // events: events,
          pastEvents: pastEvents,
          futureEvents: futureEvents
        })
      })
    }
  })

  app.get('/projects/:id', function (request, response) {
    db.Project.findOne({
      where: { id: request.params.id },
      include: [db.Event, db.User, {
        model: db.Group,
        include: [{
          model: db.Member,
          include: [db.User]
        }]
      }],
      order: [ [db.Event, 'start', 'DESC'] ]
    }).then(function (project) {
      let pastEvents = project.Events.filter(evt => (moment().diff(evt.start) > 0))
      let futureEvents = project.Events.filter(evt => (moment().diff(evt.start) < 0))
      let context = {
        project: project,
        pastEvents: pastEvents,
        futureEvents: futureEvents
      }
      if (project.about) {
        let deltaOps = project.about.ops
        let cfg = {}
        let converter = new QuillDeltaToHtmlConverter(deltaOps, cfg)
        let aboutHtml = converter.convert()
        context.aboutHtml = aboutHtml
      }
      // if (request.query.edit && request.isAuthenticated()) {
      //  context.edit = userIsMemberOfGroup(request.user, project.Group) // Checks if request user is a member of the group / Authorized to edit page
      // }
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
      if (search) context.search = search
      response.render('projects', context)
    })
  })

  app.get('/signup', function (request, response) {
    let context = { signUp: true }
    if (request.query.redirect) context.redirect = request.query.redirect
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
