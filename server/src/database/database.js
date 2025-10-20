import { Sequelize } from 'sequelize'
import mysql from 'mysql2/promise'

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB,
    logging: false
  }
)

export default {
  sequelize,
  connect: async () => {
    try {
      const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      })

      await connection.query('CREATE DATABASE IF NOT EXISTS `Laplace`')

      await connection.end()

      await sequelize.authenticate()
      console.log('Connection has been established successfully.')
      await sequelize.sync()
    } catch (error) {
      console.error('Unable to connect to the database:', error)
    }
  }
}
