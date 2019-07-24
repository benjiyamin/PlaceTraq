const chai = require('chai')
const { expect } = chai
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkPropertyExists
} = require('sequelize-test-helpers')

const EventModel = require('../../models/event')

describe('models/Event', () => {
  const Event = EventModel(sequelize, dataTypes)
  const event = new Event()

  checkModelName(Event)('Event')

  context('properties', () => {
    ['name', 'description', 'start', 'end',
      'details', 'detailsHTML'].forEach(
      checkPropertyExists(event)
    )
  })

  context('associations', () => {
    const Project = 'some dummy project'

    before(() => {
      Event.associate({ Project })
    })

    it('defined a belongsTo association with Project', () => {
      expect(Event.belongsTo).to.have.been.calledWith(Project, {
        foreignKey: {
          allowNull: false
        }
      })
    })
  })
})
