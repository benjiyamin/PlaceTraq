module.exports = function (sequelize, DataTypes) {
  let project = sequelize.define('project', {
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
      type: DataTypes.TEXT
    },
    shape: {
      type: DataTypes.GEOMETRY
    }
  })

  project.associate = function (models) {
    project.hasMany(models.event, {
      onDelete: 'CASCADE'
    })

    project.belongsToMany(models.user, { through: 'project_followers' })
  }

  return project
}
