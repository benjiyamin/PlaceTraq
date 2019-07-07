module.exports = function (app, passport) {
  /*
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup'
  }))

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login'
  }))
  */
  app.post('/signup', passport.authenticate('local-signup', {
    failureRedirect: '/signup'
  }), (request, response) => {
    response.redirect(`users/${request.user.id}`)
  })

  app.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/login'
  }), (request, response) => {
    response.redirect(`users/${request.user.id}`)
  })

  app.get('/logout', function (request, response) {
    request.session.destroy(function (error) {
      if (error) throw error
      response.redirect('/')
    })
  })
}
