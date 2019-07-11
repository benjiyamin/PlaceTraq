module.exports = function (sequelize, DataTypes) {
  let Event = sequelize.define('Event', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end: {
      type: DataTypes.DATE,
      allowNull: true
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
