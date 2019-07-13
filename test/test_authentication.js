/* eslint no-unused-expressions: 0 */

const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const server = require('../server')

// Setting up the chai http plugin
chai.use(chaiHttp)

describe('Test authentication', function () {
  describe('Unauthenticated users', function () {
    describe('PUT /api/follow', function () {
      it('should not allow unauthenticated users to access', function (done) {
        chai.request(server)
          .put('/api/follow/1')
          .end(function (err, res) {
            expect(err).to.be.null
            expect(res).to.have.status(401) // Unauthorized
            done()
          })
      })
    })
  })

  describe('Authenticated users', function () {
    describe('PUT /api/follow', function () {
      /*
      it('should allow a user to pass another their own pk', function (done) {
        let request = chai.request(server)

        request.post('/signup')
          .send({
            email: 'mail@mail.com',
            password: 'password'
          })
          .end(function () {
            request.request(server)
              .put('/api/follow?user_id=1')
              .end(function (err, res) {
                expect(err).to.be.null
                expect(res).to.have.status(200) // OK
                done()
              })
          })
      })
      */

      /*
      it('should not allow a user to pass another user\'s pk', function () {
        chai.request(server)
          .put('/api/follow?user_id=2')
          .end(function (err, res) {
            expect(err).to.be.null
            expect(res).to.have.status(403) // Forbidden
          })
      })
      */
    })
  })
})
