'use strict'
const fs = require('fs')
const path = require('path')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🌏 Seeding Vietnam Address Data (Provinces, Districts, Wards)...')

    try {
      // Path to SQL files
      const addressPath = path.join(__dirname, '../database/address')
      const createTableSQL = fs.readFileSync(
        path.join(addressPath, 'mysql_CreateTables_vn_units.sql'),
        'utf8'
      )
      const importDataSQL = fs.readFileSync(
        path.join(addressPath, 'mysql_ImportData_vn_units.sql'),
        'utf8'
      )

      // Execute CREATE TABLE statements
      console.log('📋 Creating address tables...')
      const createStatements = createTableSQL
        .split(';')
        .filter((stmt) => stmt.trim().length > 0)

      for (const statement of createStatements) {
        await queryInterface.sequelize.query(statement)
      }
      console.log('✅ Address tables created')

      // Execute INSERT statements
      console.log('📥 Importing address data (this may take a while)...')
      const insertStatements = importDataSQL
        .split(';')
        .filter((stmt) => stmt.trim().length > 0)

      let count = 0
      for (const statement of insertStatements) {
        await queryInterface.sequelize.query(statement)
        count++
        if (count % 100 === 0) {
          console.log(`   Inserted ${count} batches...`)
        }
      }
      console.log(`✅ Address data imported successfully (${count} batches)`)
    } catch (error) {
      console.error('❌ Error seeding address data:', error.message)
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    console.log('🗑️  Removing Vietnam Address Data...')

    try {
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS vn_wards')
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS vn_districts')
      await queryInterface.sequelize.query('DROP TABLE IF EXISTS vn_provinces')
      console.log('✅ Address tables removed')
    } catch (error) {
      console.error('❌ Error removing address data:', error.message)
    }
  }
}
