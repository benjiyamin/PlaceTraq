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

const GroupModel = require('../../models/group')

describe('models/Group', () => {
  const Group = GroupModel(sequelize, dataTypes)
  const group = new Group()

  checkModelName(Group)('Group')

  context('properties', () => {
    ['name', 'description'].forEach(
      checkPropertyExists(group)
    )
  })

  context('associations', () => {
    const Project = 'some dummy project'
    const Member = 'some dummy member'

    before(() => {
      Group.associate({ Project })
      Group.associate({ Member })
    })

    it('defined a hasMany association with Project', () => {
      expect(Group.hasMany).to.have.been.calledWith(Project, {
        onDelete: 'CASCADE'
      })
    })

    it('defined a hasMany association with Member', () => {
      expect(Group.hasMany).to.have.been.calledWith(Member, {
        onDelete: 'CASCADE'
      })
    })
  })
})
