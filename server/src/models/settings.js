'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Settings extends Model {
    static associate(models) {
      // no associations
    }
  }
  Settings.init(
    {
      setting_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      value: DataTypes.TEXT,
      label: DataTypes.STRING,
      description: DataTypes.STRING,
      type: {
        type: DataTypes.STRING,
        defaultValue: 'text'
      },
      group: {
        type: DataTypes.STRING,
        defaultValue: 'general'
      }
    },
    {
      sequelize,
      modelName: 'settings'
    }
  )
  return Settings
}
