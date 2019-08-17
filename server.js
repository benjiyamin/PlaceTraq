require('dotenv').config()

const express = require('express')
// const handlebars = require('express-handlebars')
const passport = require('passport')
const session = require('express-session')

const db = require('./models')
const routes = require('./routes')

let app = express()

// Middleware
app.use(express.urlencoded({
  extended: true
}))
app.use(express.json())
app.use(function (request, response, next) {
  app.locals.request = request
  next()
})

// Serve up static assets
// app.use(express.static('client/public'))

if (process.env.NODE_ENV === 'production') {
  // Serve up static assets (usually on heroku)
  app.use(express.static('client/build'))
} else {
  // Serve up static assets
  app.use(express.static('client/public'))
}

// For Passport
app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: true
})) // session secret
app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions

app.use(routes)

/*
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')))
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'))
  })
}
*/

// Load passport strategies
require('./config/passport/passport')(passport, db.User)

// When node executes this file directly, run server
if (!module.parent) {
  db.sequelize.sync({
    force: false
  })
    .then(function () {
      const PORT = process.env.PORT || 3000
      app.listen(PORT, function () {
        console.log(`App now listening at PORT ${PORT}`)
      })
    })
}

module.exports = app
