import mysql from 'mysql2/promise'
import 'dotenv/config'
import db from '@/models/index.js'

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    })
    await connection.query(
      'CREATE DATABASE IF NOT EXISTS `' + process.env.DB_NAME + '`'
    )

    await connection.end()
    await db.sequelize.authenticate()
    await db.sequelize.sync()
    console.log('Database connected successfully.')
  } catch (error) {
    console.error('Unable to connect to database:', error)
  }
}

export const checkDBConnection = async () => {
  try {
    await db.sequelize.authenticate()
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    })
    await connection.query(
      'CREATE DATABASE IF NOT EXISTS `' + process.env.DB_NAME + '`'
    )
    return true
  } catch (error) {
    return false
  }
}

export default connectDB
