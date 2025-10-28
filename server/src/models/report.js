import { Sequelize, Model, DataTypes } from 'sequelize'
import { sequelize } from '@/database/database'

const Report = sequelize.define('tbl_report', {
  report_id: { type: DataTypes.UUID, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.UUID, allowNull: false },
  lodging_id: { type: DataTypes.UUID, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false }
})

export default Report
