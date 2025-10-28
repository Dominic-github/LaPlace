import { DataTypes } from 'sequelize'
import { sequelize } from '@/database/database'

const Contract = sequelize.define(
  'tbl_contract',
  {
    contract_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      autoIncrement: true
    },
    image: { type: DataTypes.STRING, allowNull: false },
    user_id: { type: DataTypes.UUID, allowNull: false },
    lodging_id: { type: DataTypes.UUID, allowNull: false },
    landlord_id: { type: DataTypes.UUID, allowNull: false },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending'
    }
  },
  {
    timestamps: true
  }
)

export default Contract
