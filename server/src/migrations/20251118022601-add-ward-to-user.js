'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'ward_id', {
      type: Sequelize.STRING(20),
      allowNull: true,
      references: {
        model: 'wards',
        key: 'code'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'ward_id')
  }
};
