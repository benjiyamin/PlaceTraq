const router = require('express').Router()
const passport = require('passport')
// const jwt = require('jsonwebtoken')

const db = require('../../models')

router.post('/signup', passport.authenticate('local-signup', {
  failureRedirect: '/signup'
}), (req, res) => {
  // let redirect = req.query.redirect || `/users/${req.user.id}`
  let redirect = req.query.redirect || '/profile'
  res.redirect(redirect)
})

/*
router.get('/login', (req, res, next) => {
  passport.authenticate('login', (err, user, info) => {
    if (err) {
      console.log(err)
    }
    if (info !== undefined) {
      console.log(info.message)
      res.send(info.message)
    } else {
      req.logIn(user, err => {
        if (err) throw err
        db.User.findOne({
          where: {
            email: user.email
          }
        }).then(user => {
          const token = jwt.sign({ id: user.username }, process.env.JWT_SECRET)
          res.status(200).send({
            auth: true,
            token: token,
            message: 'user found & logged in'
          })
        })
      })
    }
  })(req, res, next)
})
*/

router.post('/login', passport.authenticate('local-login', {
  failureRedirect: '/login'
}), (req, res) => {
  // let redirect = req.query.redirect || `/users/${req.user.id}`
  // let redirect = req.query.redirect || '/profile'
  // res.redirect(redirect)
  res.status(200).end()
})

router.get('/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) throw error
    let redirect = req.query.redirect || '/'
    res.redirect(redirect)
  })
})

// Get request user if authenticated
router.get('/user', (req, res) => {
  if (!req.isAuthenticated()) return null // Unauthorized
  db.User.findOne({
    where: { id: req.user.id },
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
    .then(user => res.json(user))
})

module.exports = router
