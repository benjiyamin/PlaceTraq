module.exports = function (sequelize, DataTypes) {
  let Group = sequelize.define('Group', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  })

  Group.associate = function (models) {
    Group.hasMany(models.Member, {
      onDelete: 'CASCADE'
    })
  }

  return Group
}
