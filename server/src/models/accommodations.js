'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Accommodations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Accommodations.init(
    {
      accommodation_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: DataTypes.STRING,
      type: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.STRING,
      slot: DataTypes.INTEGER,
      location: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      area: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'accommodations'
    }
  )
  return Accommodations
}
