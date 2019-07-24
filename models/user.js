module.exports = function (sequelize, DataTypes) {
  let User = sequelize.define('User', {
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
    firstName: {
      type: DataTypes.STRING
    },
    lastName: {
      type: DataTypes.STRING
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active'
    }
  }, {
    getterMethods: {
      fullName () {
        return `${this.firstName} ${this.lastName}`
      }
    }
  })

  User.associate = function (models) {
    User.hasMany(models.Member, {
      onDelete: 'CASCADE'
    })

    User.belongsToMany(models.Project, {
      through: 'project_followers'
    })
  }

  return User
}
