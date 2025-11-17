'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      payment_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      payer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      contract_id: {
        type: Sequelize.UUID,
        foreignKey: true,
        references: {
          model: 'contracts',
          key: 'contract_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      payment_type: {
        type: Sequelize.STRING,
        enum: ['rent', 'deposit', 'utility', 'other'],
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      method: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        defaultValue: 'pending'
      },
      transaction_code: {
        type: Sequelize.STRING,
        unique: true
      },
      payment_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments')
  }
}
