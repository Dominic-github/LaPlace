'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('video_reviews', {
      video_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      video_url: {
        type: Sequelize.STRING,
        allowNull: false
      },
      thumbnail: {
        type: Sequelize.STRING,
        allowNull: true
      },
      accommodation_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'accommodations',
          key: 'accommodation_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      province_code: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      duration: {
        type: Sequelize.STRING,
        allowNull: true
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        defaultValue: 'active'
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
  async down(queryInterface) {
    await queryInterface.dropTable('video_reviews')
  }
}
