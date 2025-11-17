'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Contracts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contracts.init(
    {
      contract_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      owner_id: {
        type: DataTypes.UUID,
        allowNull: false,
        foreginKey: true,
        references: {
          model: 'users',
          key: 'user_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
        foreginKey: true,
        references: {
          model: 'users',
          key: 'user_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      status: DataTypes.STRING,
      pdf_url: DataTypes.STRING,
      signed_at: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'contracts'
    }
  )
  return Contracts
}
