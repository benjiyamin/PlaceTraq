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

const ProjectModel = require('../../models/project')

describe('models/Project', () => {
  const Project = ProjectModel(sequelize, dataTypes)
  const project = new Project()

  checkModelName(Project)('Project')

  context('properties', () => {
    ['name', 'description', 'start', 'end',
      'location', 'features', 'about'].forEach(
      checkPropertyExists(project)
    )
  })

  context('associations', () => {
    const Group = 'some dummy group'
    const Event = 'some dummy event'
    const User = 'some dummy user'

    before(() => {
      Project.associate({ Group })
      Project.associate({ Event })
      Project.associate({ User })
    })

    it('defined a belongsTo association with Group', () => {
      expect(Project.belongsTo).to.have.been.calledWith(Group, {
        foreignKey: {
          allowNull: false
        }
      })
    })

    it('defined a hasMany association with Event', () => {
      expect(Project.hasMany).to.have.been.calledWith(Event, {
        onDelete: 'CASCADE'
      })
    })

    it('defined a belongsToMany association with User through project_followers', () => {
      expect(Project.belongsToMany).to.have.been.calledWith(User, {
        through: 'project_followers'
      })
    })
  })
})
