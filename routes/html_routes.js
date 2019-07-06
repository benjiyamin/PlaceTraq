module.exports = function (app) {
  app.get('/', function (request, response) {
    response.render('index', {})
  })

  app.get('/project', function (request, response) {
    response.render('project', {})
  })

  app.get('/signup', function (request, response) {
    response.render('login', { signUp: true })
  })

  app.get('/login', function (request, response) {
    response.render('login', {})
  })
}
