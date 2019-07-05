module.exports = function (sequelize, DataTypes) {
  let Post = sequelize.define('Post', {
    message: {
      type: DataTypes.TEXT
    }
  })

  Post.associate = function (models) {
    Post.belongsTo(models.Project, {
      foreignKey: {
        allowNull: false
      }
    })
  }

  return Post
}
