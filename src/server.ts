import { Server } from 'http'
import mongoose from 'mongoose'
import { envVars } from './app/config/env'
import app from './app'
import { seedSuperAdmin } from './app/utils/seedSuperAdmin'

let server: Server

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL)
    console.log('Connected to DB!')
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

(async () => {
  await startServer()
  await seedSuperAdmin()
})()

process.on('SIGINT', () => {
  console.log('SIGINT signal received... Server shutting down..')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received... Server shutting down..')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('unhandledRejection', () => {
  console.log('Unhandled Rejection detected... Server shutting down..')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', () => {
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})
