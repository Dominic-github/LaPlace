'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Refresh_tokens_used extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Refresh_tokens_used.init(
    {
      refresh_token_used_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: DataTypes.UUID,
      token: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'refresh_tokens_used'
    }
  )
  return Refresh_tokens_used
}
