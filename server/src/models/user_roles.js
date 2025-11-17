'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User_roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User_roles.init(
    {
      user_roles_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      user_id: {
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
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        foreginKey: true,
        references: {
          model: 'roles',
          key: 'role_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      }
    },
    {
      sequelize,
      modelName: 'user_roles'
    }
  )
  return User_roles
}
