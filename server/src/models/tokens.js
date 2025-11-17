'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tokens.init(
    {
      token_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'user_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      public_key: DataTypes.TEXT,
      private_key: DataTypes.TEXT,
      refresh_token: {
        type: DataTypes.TEXT
      },
      type: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'tokens'
    }
  )
  return Tokens
}
