'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Payments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Payments.init(
    {
      payment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      payer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'user_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      contract_id: {
        type: DataTypes.UUID,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'contracts',
          key: 'contract_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      payment_type: DataTypes.STRING,
      amount: DataTypes.DECIMAL,
      method: DataTypes.STRING,
      status: DataTypes.STRING,
      transaction_code: DataTypes.STRING,
      payment_date: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'payments'
    }
  )
  return Payments
}
