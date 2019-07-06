module.exports = function (app, passport) {
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup'
  }))

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))

  app.get('/logout', function (request, response) {
    request.session.destroy(function (error) {
      if (error) throw error
      response.redirect('/')
    })
  })
}
