'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class RolePermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RolePermissions.init(
    {
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        foreignKey: true,
        references: {
          model: 'roles',
          key: 'role_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      },
      permission_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        foreignKey: true,
        references: {
          model: 'permissions',
          key: 'permission_id',
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        }
      }
    },
    {
      sequelize,
      modelName: 'role_permissions'
    }
  )
  return RolePermissions
}
