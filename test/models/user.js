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

const UserModel = require('../../models/user')

describe('models/User', () => {
  const User = UserModel(sequelize, dataTypes)
  const user = new User()

  checkModelName(User)('User')

  context('properties', () => {
    ['email', 'password', 'firstName', 'lastName',
      'lastLogin', 'status'].forEach(
      checkPropertyExists(user)
    )
  })

  context('associations', () => {
    const Post = 'some dummy post'
    const Member = 'some dummy member'
    const Project = 'some dummy project'

    before(() => {
      User.associate({ Post })
      User.associate({ Member })
      User.associate({ Project })
    })

    it('defined a hasMany association with Post', () => {
      expect(User.hasMany).to.have.been.calledWith(Post, {
        onDelete: 'CASCADE'
      })
    })

    it('defined a hasMany association with Member', () => {
      expect(User.hasMany).to.have.been.calledWith(Member, {
        onDelete: 'CASCADE'
      })
    })

    it('defined a belongsToMany association with Project through project_followers', () => {
      expect(User.belongsToMany).to.have.been.calledWith(Project, {
        through: 'project_followers'
      })
    })
  })
})
