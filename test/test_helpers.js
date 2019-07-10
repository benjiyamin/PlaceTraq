/* eslint no-unused-expressions: 0 */

const chai = require('chai')
const expect = chai.expect

const helpers = require('../helpers/helpers')

describe('helpers', function () {
  describe('.currentDate(formatString)', function () {
    it('should return the current date', function () {
      let today = new Date()
      let dd = today.getDate()
      let mm = today.getMonth() + 1 // January is 0!
      let yyyy = today.getFullYear()

      if (dd < 10) { dd = '0' + dd }
      if (mm < 10) { mm = '0' + mm }
      let formatted = `${yyyy}-${mm}-${dd}`
      expect(helpers.currentDate('YYYY-MM-DD')).to.equal(formatted)
    })
  })

  describe('.length(array)', function () {
    it('should return the length of an array', function () {
      expect(helpers.length([1, 2, 3])).to.equal(3)
    })
  })
})
