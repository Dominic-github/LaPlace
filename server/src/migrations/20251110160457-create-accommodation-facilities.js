'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('accommodation_facilities', {
      facility_id: {
        primaryKey: true,
        fogeignKey: true,
        type: Sequelize.UUID,
        references: {
          model: 'facilities',
          key: 'facility_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      accommodation_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        foreignKey: true,
        references: {
          model: 'accommodations',
          key: 'accommodation_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
    await queryInterface.dropTable('accommodation_facilities')
  }
}
