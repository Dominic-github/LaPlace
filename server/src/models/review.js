import { Sequelize, Model, DataTypes } from 'sequelize'
import { sequelize } from '@/database/database'

const Lodging = sequelize.define('tbl_lodging', {
  lodging_id: { type: DataTypes.UUID, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false }
})

export default Lodging
