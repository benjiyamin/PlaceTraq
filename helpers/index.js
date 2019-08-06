const helpers = {}

helpers.isAuthenticated = request => request.isAuthenticated()

helpers.userFollowsProject = function (user, project) {
  return user && project && project.Users.filter(u => (u.id === user.id))
}

helpers.userIsMemberOfGroup = function (user, group) {
  const users = group.Members.map(member => member.User)
  if (user && group && users.filter(u => (u.id === user.id)).length) {
    return true
  } else {
    return false
  }
}

helpers.userIsOwnerOfGroup = function (user, group) {
  const members = group.Members.filter(m => (m.isOwner === true))
  const users = members.map(member => member.User)
  if (user && group && users.filter(u => (u.id === user.id)).length) {
    return true
  } else {
    return false
  }
}

module.exports = helpers
