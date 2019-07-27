const router = require('express').Router()
const passport = require('passport')

router.post('/signup', passport.authenticate('local-signup', {
  failureRedirect: '/signup'
}), (request, response) => {
  let redirect = request.query.redirect || `/users/${request.user.id}`
  response.redirect(redirect)
})

router.post('/login', passport.authenticate('local-login', {
  failureRedirect: '/login'
}), (request, response) => {
  let redirect = request.query.redirect || `/users/${request.user.id}`
  response.redirect(redirect)
})

router.get('/logout', function (request, response) {
  request.session.destroy(error => {
    if (error) throw error
    let redirect = request.query.redirect || '/'
    response.redirect(redirect)
  })
})

module.exports = router
