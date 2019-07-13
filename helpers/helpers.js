const helpers = require('handlebars-helpers')(['array', 'date', 'string'])

helpers.section = function (name, options) {
  if (!this._sections) this._sections = {}
  this._sections[name] = options.fn(this)
  return null
}

helpers.isAuthenticated = function (request) {
  return request.isAuthenticated()
}

helpers.userFollowsProject = function (user, project) {
  return user && project && project.Users.filter(u => (u.id === user.id))
}

helpers.userIsMemberOfGroup = function (user, group) {
  let users = group.Members.map(member => member.User)
  if (user && group && users.filter(u => (u.id === user.id)).length) {
    return true
  } else {
    return false
  }
}

module.exports = helpers
