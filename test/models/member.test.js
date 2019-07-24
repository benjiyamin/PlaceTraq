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

const MemberModel = require('../../models/member')

describe('models/Member', () => {
  const Member = MemberModel(sequelize, dataTypes)
  const member = new Member()

  checkModelName(Member)('Member')

  context('properties', () => {
    ['isOwner'].forEach(
      checkPropertyExists(member)
    )
  })

  context('associations', () => {
    const Group = 'some dummy group'
    const User = 'some dummy user'

    before(() => {
      Member.associate({ Group })
      Member.associate({ User })
    })

    it('defined a belongsTo association with Group', () => {
      expect(Member.belongsTo).to.have.been.calledWith(Group, {
        foreignKey: {
          allowNull: false
        }
      })
    })

    it('defined a belongsTo association with User', () => {
      expect(Member.belongsTo).to.have.been.calledWith(User, {
        foreignKey: {
          allowNull: false
        }
      })
    })
  })
})
