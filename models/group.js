module.exports = function (sequelize, DataTypes) {
  let Group = sequelize.define('Group', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    }
  } /* , {
    instanceMethods: {
      hasUser: function (user, cb) {
        sequelize.models.Member.findOne({
          where: {
            User: {
              id: user.id
            },
            Group: {
              id: this.id
            }
          }
        })
          .then(function (dbUser) {
            if (dbUser) {
              cb(null, true)
            } else {
              cb(null, false)
            }
          })
      }
    }
  } */)

  Group.associate = function (models) {
    Group.hasMany(models.Project, {
      onDelete: 'CASCADE'
    })

    Group.hasMany(models.Member, {
      onDelete: 'CASCADE'
    })
  }

  return Group
}
