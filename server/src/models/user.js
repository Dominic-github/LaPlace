import { Sequelize, Model, DataTypes } from 'sequelize'
import { sequelize } from '@/database/database'

const User = sequelize.define(
  'tbl_user',
  {
    user_id: { type: DataTypes.UUID, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  },
  {
    timestamps: true
  }
)

export default User
