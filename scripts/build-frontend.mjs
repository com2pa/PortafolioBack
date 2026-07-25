import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backendRoot = path.resolve(__dirname, '..')
const frontendRoot = path.resolve(backendRoot, '../frontend')
const frontendDist = path.join(frontendRoot, 'dist')
const backendDist = path.join(backendRoot, 'dist')

if (!fs.existsSync(path.join(frontendRoot, 'package.json'))) {
  console.error('No se encontró ../frontend. ¿Está el repo del front al lado del backend?')
  process.exit(1)
}

console.log('→ Building frontend (VITE_API_URL=/api)…')
execSync('npm run build', {
  cwd: frontendRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    VITE_API_URL: '/api',
  },
})

if (!fs.existsSync(frontendDist)) {
  console.error('El build no generó frontend/dist')
  process.exit(1)
}

console.log('→ Copiando frontend/dist → backend/dist…')
fs.rmSync(backendDist, { recursive: true, force: true })
fs.cpSync(frontendDist, backendDist, { recursive: true })

console.log('Listo. El backend servirá la web desde /dist')
