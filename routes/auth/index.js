const router = require('express').Router()
const passport = require('passport')

const db = require('../../models')

router.post('/signup', passport.authenticate('local-signup', {
  failureRedirect: '/signup'
}), (req, res) => {
  // let redirect = req.query.redirect || `/users/${req.user.id}`
  let redirect = req.query.redirect || '/profile'
  res.redirect(redirect)
})

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
