/* eslint-disable no-unused-expressions */

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../server')

const db = require('../../models')

const expect = chai.expect

// Setting up the chai http plugin
chai.use(chaiHttp)

describe('API routes', () => {
  // Before all tests begin,
  // 1) create a new request server for testing
  // 2) sync schema from the db
  // 3) create the testing data
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
      .then(dbProjects => {
        let dbProject1 = dbProjects[0]
        let events = [
          { name: 'Event 1', start: new Date() },
          { name: 'Event 2', start: new Date() },
          { name: 'Event 3', start: new Date() }
        ]
        events.forEach(event => { event.ProjectId = dbProject1.id })
        return db.Event.bulkCreate(events)
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
          expect(res.body)
            .to.be.null
          done()
        })
    })
  })

  describe('GET /api/events', () => {
    it('should find all events', done => {
      chai.request(server)
        .get('/api/events').end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body)
            .to.be.an('array')
            .that.has.lengthOf(3)
          expect(res.body[0])
            .to.be.an('object')
            .that.includes({ name: 'Event 1' })
          expect(res.body[1])
            .to.be.an('object')
            .that.includes({ name: 'Event 2' })
          expect(res.body[2])
            .to.be.an('object')
            .that.includes({ name: 'Event 3' })
          done()
        })
    })
  })

  describe('GET /api/events/:id', () => {
    it('should return one event if ID matches existing', done => {
      chai.request(server)
        .get('/api/events/1').end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body)
            .to.be.an('object')
            .that.includes({ name: 'Event 1' })
          done()
        })
    })

    it('should return null if ID doesn\'t match existing', done => {
      chai.request(server)
        .get('/api/events/10').end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(200)
          expect(res.body)
            .to.be.null
          done()
        })
    })
  })

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
