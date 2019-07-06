module.exports = function (app, passport) {
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup'
  }))

  app.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/',
    failureRedirect: '/sigin'
  }))

  app.get('/logout', function (request, response) {
    request.session.destroy(function (error) {
      if (error) throw error
      response.redirect('/')
    })
  })
}
