/* eslint-disable no-unused-expressions */

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../server')

const db = require('../../../models')

const expect = chai.expect

// Setting up the chai http plugin
chai.use(chaiHttp)

describe('routes/api/projects', () => {
  // Before all tests begin,
  // 1) sync schema from the models to db
  // 2) create the testing data
  before(done => {
    db.sequelize.sync({ force: true })
      .then(() => { return db.Group.create({ name: 'First Group' }) })
      .then(dbGroup => {
        return db.Project.bulkCreate([
          {
            name: 'First Project',
            description: 'First Description',
            start: new Date(),
            end: new Date(),
            GroupId: dbGroup.id
          },
          {
            name: 'Second Project',
            description: 'Second Description',
            start: new Date(),
            end: new Date(),
            GroupId: dbGroup.id
          }
        ])
      })
      .then(() => done())
      .catch(error => {
        done()
        throw error
      })
    // done()
  })

  describe('GET /api/projects', () => {
    it('should find all projects', done => {
      chai.request(server)
        .get('/api/projects').end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body)
            .to.be.an('array')
            .that.has.lengthOf(2)
          expect(res.body[0])
            .to.be.an('object')
            .that.includes({ name: 'First Project', description: 'First Description' })
          expect(res.body[1])
            .to.be.an('object')
            .that.includes({ name: 'Second Project', description: 'Second Description' })
          done()
        })
    })
  })

  describe('GET /api/projects/:id', () => {
    it('should return one project if ID matches existing', done => {
      chai.request(server)
        .get('/api/projects/1').end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body)
            .to.be.an('object')
            .that.includes({ name: 'First Project', description: 'First Description' })
          done()
        })
    })

    it('should return null if ID doesn\'t match existing', done => {
      chai.request(server)
        .get('/api/projects/10').end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body).to.be.null
          done()
        })
    })
  })

  describe('POST /api/projects', () => {
    it('should return a 401 error if the user isn\'t logged in', done => {
      chai.request(server)
        .post('/api/projects').end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(401)
          done()
        })
    })
  })

  describe('PUT /api/follow/:id', () => {
    it('should return a 401 error if the user isn\'t logged in', done => {
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
