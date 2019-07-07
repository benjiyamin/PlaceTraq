module.exports = function (sequelize, DataTypes) {
  let Post = sequelize.define('Post', {
    message: {
      type: DataTypes.TEXT
    }
  }, {
    timestamps: true
  })

  Post.associate = function (models) {
    Post.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      }
    })
  }

  Post.associate = function (models) {
    Post.belongsTo(models.Project, {
      foreignKey: {
        name: 'projectId',
        allowNull: false
      }
    })
  }

  return Post
}
