module.exports = function (sequelize, DataTypes) {
  let Project = sequelize.define('Project', {
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
      allowNull: false
    },
    location: {
      type: DataTypes.GEOMETRY
    }
  })

  Project.associate = function (models) {
    Project.hasMany(models.Event, {
      onDelete: 'CASCADE'
    })
  }

  return Project
}
