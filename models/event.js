module.exports = function (sequelize, DataTypes) {
  let event = sequelize.define('event', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  })

  event.associate = function (models) {
    event.belongsTo(models.project, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return event
}
