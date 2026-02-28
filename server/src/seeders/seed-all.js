#!/usr/bin/env node
'use strict'

/**
 * SEED ALL - LaPlace Database Seeder
 * Chạy tất cả các seeders theo thứ tự
 * 
 * Usage:
 *   node src/seeders/seed-all.js
 *   npm run seed:all
 *   yarn seed:all
 */

const path = require('path')
const fs = require('fs')

// Import database connection
const db = require('../models')
const sequelize = db.sequelize

// Màu sắc cho console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.blue}${'='.repeat(60)}${colors.reset}\n${colors.blue}${msg}${colors.reset}\n${colors.blue}${'='.repeat(60)}${colors.reset}\n`)
}

/**
 * Lấy danh sách tất cả seeders theo thứ tự timestamp
 */
function getSeeders() {
  const seedersDir = __dirname
  const files = fs.readdirSync(seedersDir)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== 'seed-all.js' &&
        file.slice(-3) === '.js'
      )
    })
    .sort() // Sort theo timestamp trong tên file

  return files.map(file => ({
    file,
    path: path.join(seedersDir, file)
  }))
}

/**
 * Chạy một seeder
 */
async function runSeeder(seeder, queryInterface, Sequelize) {
  try {
    log.info(`Running: ${seeder.file}`)
    const seederModule = require(seeder.path)

    if (typeof seederModule.up === 'function') {
      await seederModule.up(queryInterface, Sequelize)
      log.success(`Completed: ${seeder.file}`)
      return true
    } else {
      log.warn(`Skipped: ${seeder.file} (no 'up' method)`)
      return false
    }
  } catch (error) {
    log.error(`Failed: ${seeder.file}`)
    console.error(error)
    throw error
  }
}

/**
 * Main function
 */
async function seedAll() {
  log.header('🌱 LaPlace Database Seeding')

  const startTime = Date.now()
  let successCount = 0
  let failedCount = 0

  try {
    // Test database connection
    log.info('Testing database connection...')
    await sequelize.authenticate()
    log.success('Database connection established')

    // Get all seeders
    const seeders = getSeeders()
    log.info(`Found ${seeders.length} seeder(s) to run`)

    if (seeders.length === 0) {
      log.warn('No seeders found!')
      return
    }

    // Get queryInterface
    const queryInterface = sequelize.getQueryInterface()
    const Sequelize = require('sequelize')

    // Prompt confirmation
    console.log('\n📋 Seeders to execute:')
    seeders.forEach((seeder, index) => {
      console.log(`   ${index + 1}. ${seeder.file}`)
    })
    console.log('')

    // Ask for confirmation (nếu không có flag --yes)
    const args = process.argv.slice(2)
    if (!args.includes('--yes') && !args.includes('-y')) {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      })

      const answer = await new Promise(resolve => {
        readline.question('❓ Do you want to continue? (yes/no): ', resolve)
      })
      readline.close()

      if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
        log.warn('Seeding cancelled by user')
        process.exit(0)
      }
    }

    console.log('')

    // Run all seeders
    for (let i = 0; i < seeders.length; i++) {
      console.log(`\n[${i + 1}/${seeders.length}] ===========================`)
      try {
        await runSeeder(seeders[i], queryInterface, Sequelize)
        successCount++
      } catch (error) {
        failedCount++

        // Ask if continue on error
        if (i < seeders.length - 1) {
          const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
          })

          const answer = await new Promise(resolve => {
            readline.question('❓ Continue with remaining seeders? (yes/no): ', resolve)
          })
          readline.close()

          if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
            log.warn('Seeding stopped by user after error')
            break
          }
        }
      }
    }

    // Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    log.header('📊 Seeding Summary')
    console.log(`✅ Successful: ${successCount}`)
    console.log(`❌ Failed: ${failedCount}`)
    console.log(`⏱️  Duration: ${duration}s`)
    console.log('')

    if (failedCount > 0) {
      log.error('Seeding completed with errors')
      process.exit(1)
    } else {
      log.success('All seeders completed successfully! 🎉')
      process.exit(0)
    }

  } catch (error) {
    log.error('Seeding failed!')
    console.error(error)
    process.exit(1)
  } finally {
    // Close database connection
    await sequelize.close()
  }
}

// Run
if (require.main === module) {
  seedAll()
}

module.exports = seedAll
