module.exports = function (sequelize, DataTypes) {
  let Event = sequelize.define('Event', {
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

  Event.associate = function (models) {
    Event.belongsTo(models.Project, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return Event
}
