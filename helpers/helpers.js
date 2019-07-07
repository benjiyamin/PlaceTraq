const moment = require('moment')

module.exports = {
  section: function (name, options) {
    if (!this._sections) this._sections = {}
    this._sections[name] = options.fn(this)
    return null
  },
  isAuthenticated: function (request) {
    return request.isAuthenticated()
  },
  formatDate: function (date, formatString) {
    return moment(date).format(formatString)
  },
  currentDate: function (formatString) {
    return moment().format(formatString)
  },
  length: function (array) {
    return array.length
  },
  userFollowsProject: function (request, project) {
    if (request.isAuthenticated()) {
      return project.Users.filter(u => (u.id === request.user.id))
    }
    return false
  }
}
