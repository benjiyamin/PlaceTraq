module.exports = function (sequelize, DataTypes) {
  let Project = sequelize.define('Project', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
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
    },
    about: {
      type: DataTypes.JSON
    }
  })

  Project.associate = function (models) {
    Project.belongsTo(models.Group, {
      foreignKey: {
        allowNull: false
      }
    })

    Project.hasMany(models.Event, {
      onDelete: 'CASCADE'
    })

    Project.belongsToMany(models.User, {
      through: 'project_followers'
    })
  }

  return Project
}
