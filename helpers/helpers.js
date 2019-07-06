const moment = require('moment')

module.exports = {
  isAuthenticated: function (request) {
    return request.isAuthenticated()
  },
  formatDate: function (date, formatString) {
    return moment(date).format(formatString)
  },
  currentDate: function (formatString) {
    return moment().format(formatString)
  }
}
