module.exports = function (sequelize, DataTypes) {
  let user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    last_login: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  })

  user.associate = function (models) {
    user.hasMany(models.post, {
      onDelete: 'CASCADE'
    })

    user.belongsToMany(models.project, { through: 'project_followers' })
  }

  return user
}
