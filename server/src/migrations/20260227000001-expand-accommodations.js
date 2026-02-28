'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('accommodations', 'bedrooms', {
      type: Sequelize.INTEGER,
      defaultValue: 1
    })
    await queryInterface.addColumn('accommodations', 'bathrooms', {
      type: Sequelize.INTEGER,
      defaultValue: 1
    })
    await queryInterface.addColumn('accommodations', 'deposit_months', {
      type: Sequelize.INTEGER,
      defaultValue: 1
    })
    await queryInterface.addColumn('accommodations', 'status', {
      type: Sequelize.ENUM('active', 'inactive', 'pending'),
      defaultValue: 'active'
    })
    await queryInterface.addColumn('accommodations', 'province_code', {
      type: Sequelize.STRING(20),
      allowNull: true
    })
    await queryInterface.addColumn('accommodations', 'ward_code', {
      type: Sequelize.STRING(20),
      allowNull: true
    })
    await queryInterface.addColumn('accommodations', 'latitude', {
      type: Sequelize.DECIMAL(10, 8),
      allowNull: true
    })
    await queryInterface.addColumn('accommodations', 'longitude', {
      type: Sequelize.DECIMAL(11, 8),
      allowNull: true
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('accommodations', 'bedrooms')
    await queryInterface.removeColumn('accommodations', 'bathrooms')
    await queryInterface.removeColumn('accommodations', 'deposit_months')
    await queryInterface.removeColumn('accommodations', 'status')
    await queryInterface.removeColumn('accommodations', 'province_code')
    await queryInterface.removeColumn('accommodations', 'ward_code')
    await queryInterface.removeColumn('accommodations', 'latitude')
    await queryInterface.removeColumn('accommodations', 'longitude')
  }
}
