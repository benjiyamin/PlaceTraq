module.exports = function (app, passport) {
  app.post('/signup', passport.authenticate('local-signup', {
    failureRedirect: '/signup'
  }), (request, response) => {
    let redirect = request.query.redirect || `/users/${request.user.id}`
    response.redirect(redirect)
  })

  app.post('/login', passport.authenticate('local-login', {
    failureRedirect: '/login'
  }), (request, response) => {
    let redirect = request.query.redirect || `/users/${request.user.id}`
    response.redirect(redirect)
  })

  app.get('/logout', function (request, response) {
    request.session.destroy(error => {
      if (error) throw error
      let redirect = request.query.redirect || '/'
      response.redirect(redirect)
    })
  })
}
