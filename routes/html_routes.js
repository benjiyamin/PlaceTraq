module.exports = function (app) {
  app.get('/', function (request, response) {
    response.render('index', {})
  })

  app.get('/project', function (request, response) {
    response.render('project', {})
  })
}
