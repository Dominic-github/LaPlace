'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bookings.init(
    {
      booking_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
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
      accommodation_id: {
        type: DataTypes.UUID,
        allowNull: false,
        foreginKey: true,
        references: {
          model: 'accommodations',
          key: 'accommodation_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      landlord_id: {
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
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      status: DataTypes.STRING,
      total_price: DataTypes.DECIMAL,
      payment_status: DataTypes.STRING,
      note: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'bookings'
    }
  )
  return Bookings
}
