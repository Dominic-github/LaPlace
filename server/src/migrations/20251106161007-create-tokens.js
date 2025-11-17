'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tokens', {
      token_id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        unique: true,
        foreignKey: true,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      public_key: {
        type: Sequelize.TEXT
      },
      private_key: {
        type: Sequelize.TEXT
      },
      refresh_token: {
        type: Sequelize.TEXT
      },
      type: {
        type: Sequelize.STRING,
        defaultValue: 'access',
        enum: ['access', 'refresh', 'verify', 'reset']
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
    await queryInterface.dropTable('tokens')
  }
}
