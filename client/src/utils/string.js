import _ from 'lodash'

export const truncate = function (str, limit, suffix) {
  if (_.isString(str)) {
    if (typeof suffix !== 'string') {
      suffix = ''
    }
    if (str.length > limit) {
      return str.slice(0, limit - suffix.length) + suffix
    }
    return str
  }
}

export const ellipsis = function (str, limit) {
  if (_.isString(str)) {
    if (str.length <= limit) {
      return str
    }
    return truncate(str, limit) + '…'
  }
}
