const helpers = require('handlebars-helpers')(['array', 'date', 'string'])

helpers.section = function (name, options) {
  if (!this._sections) this._sections = {}
  this._sections[name] = options.fn(this)
  return null
}

helpers.isAuthenticated = function (request) {
  return request.isAuthenticated()
}

helpers.userFollowsProject = function (request, project) {
  if (request.isAuthenticated()) {
    return project.Users.filter(u => (u.id === request.user.id))
  }
  return false
}

module.exports = helpers
