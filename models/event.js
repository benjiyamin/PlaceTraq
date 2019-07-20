const QuillDeltaToHtmlConverter = require('quill-delta-to-html').QuillDeltaToHtmlConverter

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
    },
    details: {
      type: DataTypes.JSON
    },
    detailsHTML: {
      type: DataTypes.VIRTUAL,
      get () {
        let details = this.getDataValue('details')
        if (details) {
          let cfg = {}
          let deltaOps = details.ops
          let converter = new QuillDeltaToHtmlConverter(deltaOps, cfg)
          return converter.convert()
        }
      }
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
