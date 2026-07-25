# Despliegue en Render (API)

Este repo se despliega como **Web Service**. La guía completa (front + API) está en el repo frontend: `DEPLOY-RENDER.md`.

## Resumen rápido

1. New Web Service → `PortafolioBack`
2. Build: `npm install` · Start: `npm start` · Health: `/api/health`
3. Env: `MONGO_URI_TEST`, `ACCESS_TOKEN_SECRET`, `CLIENT_URL` (URL del Static Site), `COOKIE_SAMESITE=none`, emails, `ADMIN_*`
4. Después crea el Static Site del frontend con `VITE_API_URL=https://ESTA-API.onrender.com/api`

También puedes usar el Blueprint `render.yaml` de este repo.
