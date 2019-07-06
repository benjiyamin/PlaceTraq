require('dotenv').config()

const express = require('express')
const handlebars = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')

const db = require('./models')

let app = express()

// Middleware
app.use(express.static('public'))
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
app.use(function (request, response, next) {
  app.locals.request = request
  next()
})

// For Passport
app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: true
})) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions

// Template engine
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./helpers/helpers')
}))
app.set('view engine', 'handlebars')

require('./routes/api_routes')(app)
require('./routes/html_routes')(app)
require('./routes/auth_routes')(app, passport)

// Load passport strategies
require('./config/passport/passport')(passport, db.User)

db.sequelize.sync({
  force: false
})
  .then(function () {
    const PORT = process.env.PORT || 3000
    app.listen(PORT, function () {
      console.log(`App now listening at PORT ${PORT}`)
    })
  })
