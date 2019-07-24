/* eslint-disable no-unused-expressions */

const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../server')

const db = require('../../../models')

const expect = chai.expect

// Setting up the chai http plugin
chai.use(chaiHttp)

describe('routes/api/events', () => {
  // Before all tests begin,
  // 1) sync schema from the models to db
  // 2) create the testing data
  before(done => {
    db.sequelize.sync({ force: true })
      .then(() => { return db.Group.create({ name: 'First Group' }) })
      .then(dbGroup => {
        return db.Project.create({
          name: 'First Project',
          description: 'First Description',
          start: new Date(),
          end: new Date(),
          GroupId: dbGroup.id
        })
      })
      .then(dbProject => {
        let events = [
          { name: 'Event 1', start: new Date() },
          { name: 'Event 2', start: new Date() },
          { name: 'Event 3', start: new Date() }
        ]
        events.forEach(event => { event.ProjectId = dbProject.id })
        return db.Event.bulkCreate(events)
      })
      .catch(error => { throw error })
      .then(() => done())
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
          expect(res.body).to.be.null
          done()
        })
    })
  })

  describe('POST /api/events', () => {
    it('should return a 401 error if the user isn\'t logged in', done => {
      chai.request(server)
        .post('/api/events').end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(401)
          done()
        })
    })
  })

  describe('PUT /api/projects', () => {
    it('should return a 401 error if the user isn\'t logged in', done => {
      chai.request(server)
        .put('/api/events').end((err, res) => {
          expect(err).to.be.null
          expect(res.status).to.equal(401)
          done()
        })
    })
  })
})
