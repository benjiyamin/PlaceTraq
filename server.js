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

// For Passport
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
})) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions

// Template engine
app.engine('handlebars', handlebars({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

require('./routes/api_routes')(app)
require('./routes/html_routes')(app)
require('./routes/auth_routes.js')(app, passport)

// Load passport strategies
require('./config/passport/passport.js')(passport, db.User)

db.sequelize.sync({
  force: true
})
  .then(function () {
    const PORT = process.env.PORT || 8080
    app.listen(PORT, function () {
      console.log(`App now listening at PORT ${PORT}`)
    })
  })
