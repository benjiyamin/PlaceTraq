/* eslint-disable no-unused-expressions */

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../server')

const db = require('../../../models')

const expect = chai.expect

// Setting up the chai http plugin
chai.use(chaiHttp)

describe('routes/api/groups', () => {
  // Before all tests begin,
  // 1) sync schema from the models to db
  // 2) create the testing data
  before(done => {
    db.sequelize.sync({ force: true })
      .then(() => { return db.Group.create({ name: 'First Group' }) })
      .catch(error => { throw error })
      .then(() => done())
  })

  describe('POST /api/groups', () => {
    it('should return a 401 error if the user isn\'t logged in', done => {
      chai.request(server)
        .post('/api/groups').end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(401)
          done()
        })
    })
  })

  describe('PUT /api/groups', () => {
    it('should return a 401 error if the user isn\'t logged in', done => {
      chai.request(server)
        .put('/api/groups').end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(401)
          done()
        })
    })
  })
})
