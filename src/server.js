import { createApp } from './app.js'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'
import { seedDatabase } from './seed/seed.js'

async function bootstrap() {
  await connectDB()
  await seedDatabase()

  const app = createApp()

  app.listen(env.port, () => {
    console.log(`API en http://localhost:${env.port}`)
    console.log(`CORS origen: ${env.clientUrl}`)
  })
}

bootstrap().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error.message)
  process.exit(1)
})
