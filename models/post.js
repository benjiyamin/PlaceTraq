module.exports = function (sequelize, DataTypes) {
  let post = sequelize.define('post', {
    message: {
      type: DataTypes.TEXT
    }
  })

  post.associate = function (models) {
    post.belongsTo(models.user, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  post.associate = function (models) {
    post.belongsTo(models.project, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return post
}
