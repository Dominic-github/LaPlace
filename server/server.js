import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

import routes from './src/routes/index.js'

import db from './src/database/database.js'

const PORT = parseInt(process.env.APP_PORT || process.env.PORT || '8000')
const app = express()

app.use(
  cors({
    origin: process.env.APP_URL,
    credentials: true
  })
)

app.use(morgan('dev'))
app.use(
  helmet.frameguard({
    action: 'deny'
  })
)

// strict transport security
const reqDuration = 2629746000
app.use(
  helmet.hsts({
    maxAge: reqDuration
  })
)

// content security policy
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"]
    }
  })
)

// x content type options
app.use(helmet.noSniff())
// x xss protection
app.use(helmet.xssFilter())
// referrer policy
app.use(
  helmet.referrerPolicy({
    policy: 'no-referrer'
  })
)

// downsize response
app.use(
  compression({
    level: 6, // level compress
    threshold: 100 * 1024, // > 100kb threshold to compress
    filter: (req) => {
      return !req.headers['x-no-compress']
    }
  })
)

app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// init db
;(async () => {
  await db.connect()
})()

// init route
app.get('/', (req, res) => {
  res.send(`Hello World! LaPlace API is running... ${process.env.APP_URL}`)
})

app.use('', routes)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}, http://localhost:${PORT} `)
})
