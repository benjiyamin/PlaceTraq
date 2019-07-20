const helpers = require('handlebars-helpers')(['array', 'date', 'string', 'comparison'])

const STATUS_CODES = require('statuses').STATUS_CODES

helpers.section = function (name, options) {
  if (!this._sections) this._sections = {}
  this._sections[name] = options.fn(this)
  return null
}

helpers.statusMessage = code => STATUS_CODES[`${code}`]

helpers.isAuthenticated = request => request.isAuthenticated()

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

helpers.userIsOwnerOfGroup = function (user, group) {
  let members = group.Members.filter(m => (m.isOwner === true))
  let users = members.map(member => member.User)
  if (user && group && users.filter(u => (u.id === user.id)).length) {
    return true
  } else {
    return false
  }
}

module.exports = helpers
