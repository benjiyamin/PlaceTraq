module.exports = function (sequelize, DataTypes) {
  let Member = sequelize.define('Member', {
    isOwner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  })

  Member.associate = function (models) {
    Member.belongsTo(models.Group, {
      foreignKey: {
        allowNull: false
      }
    })

    Member.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return Member
}
