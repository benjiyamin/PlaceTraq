const Op = require('sequelize').Op

const moment = require('moment')
const _ = require('lodash')
const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter

const db = require('../models')
const userIsMemberOfGroup = require('../helpers/helpers').userIsMemberOfGroup

module.exports = function (app) {
  app.get('/', function (req, res) {
    res.render('index', {})
  })

  app.get('/groups/:id', function (req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login') // Unauthorized
    db.Group.findOne({
      where: { id: req.params.id },
      include: [db.Project, {
        model: db.Member,
        include: [db.User, db.Group]
      }],
      order: [ [db.Member, 'isOwner', 'ASC'] ]
    })
      .then(group => {
        if (!group) return res.render('status', { code: 404 }) // No group found
        if (!userIsMemberOfGroup(req.user, group)) return res.redirect('/') // Forbidden
        res.render('group', { group: group })
      })
      .catch(error => {
        res.render('status', { code: 500 })
        throw error
      })
  })

  app.get('/users/:id', function (req, res) {
    if (!req.isAuthenticated()) return res.redirect('/login') // Unauthorized
    if (req.user.id.toString() !== req.params.id) return res.redirect('/') // Forbidden
    db.User.findOne({
      where: { id: req.params.id },
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
    })
      .then(user => {
        if (!user) return res.render('status', { code: 404 }) // No user found
        let events = []
        user.Projects.forEach(project => {
          project.Events.forEach(event => {
            events.push(event)
          })
        })
        events = _.sortBy(events, ['start']).reverse()
        let pastEvents = events.filter(evt => (moment().diff(evt.start) > 0))
        let futureEvents = events.filter(evt => (moment().diff(evt.start) < 0))
        res.render('user', {
          user: user,
          // events: events,
          pastEvents: pastEvents,
          futureEvents: futureEvents
        })
      })
      .catch(error => {
        res.render('status', { code: 500 })
        throw error
      })
  })

  app.get('/projects/:id/map', function (req, res) {
    db.Project.findOne({
      where: { id: req.params.id },
      include: [{
        model: db.Group,
        include: [{
          model: db.Member,
          include: [db.User]
        }]
      }]
    })
      .then(project => {
        if (!project) return res.render('status', { code: 404 }) // No project found
        res.render('map', { project: project })
      })
      .catch(error => {
        res.render('status', { code: 500 })
        throw error
      })
  })

  app.get('/projects/:id', function (req, res) {
    db.Project.findOne({
      where: { id: req.params.id },
      include: [db.Event, db.User, {
        model: db.Group,
        include: [{
          model: db.Member,
          include: [db.User]
        }]
      }],
      order: [ [db.Event, 'start', 'DESC'] ]
    })
      .then(project => {
        if (!project) return res.render('status', { code: 404 }) // No project found
        let pastEvents = project.Events.filter(evt => (moment().diff(evt.start) > 0))
        let futureEvents = project.Events.filter(evt => (moment().diff(evt.start) < 0))
        let context = {
          project: project,
          pastEvents: pastEvents,
          futureEvents: futureEvents
        }
        if (project.about) {
          let cfg = {}
          let deltaOps = project.about.ops
          let converter = new QuillDeltaToHtmlConverter(deltaOps, cfg)
          let aboutHtml = converter.convert()
          context.aboutHtml = aboutHtml
        }
        res.render('project', context)
      })
      .catch(error => {
        res.render('status', { code: 500 })
        throw error
      })
  })

  app.get('/projects', function (req, res) {
    let search = req.query.search
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
    db.Project.findAll(findQuery)
      .then(function (projects) {
        let context = { projects: projects }
        if (search) context.search = search
        res.render('projects', context)
      })
      .catch(error => {
        res.render('status', { code: 500 })
        throw error
      })
  })

  app.get('/signup', function (req, res) {
    let context = { signUp: true }
    if (req.query.redirect) context.redirect = req.query.redirect
    res.render('login', context)
  })

  app.get('/login', function (req, res) {
    let context = {}
    if (req.query.redirect) context.redirect = req.query.redirect
    res.render('login', context)
  })
}
