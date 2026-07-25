# Portafolio — Backend (API)

API Express del portafolio de Merwil Vegas. Despliegue en Render: ver también `../frontend/DEPLOY-RENDER.md` (o el archivo equivalente en el repo frontend).

## Arranque local

```bash
npm install
cp .env.example .env
npm run dev
```

## Producción (Render)

- **Type:** Web Service  
- **Build:** `npm install`  
- **Start:** `npm start`  
- **Health:** `GET /api/health`

Variables mínimas: `MONGO_URI_TEST`, `ACCESS_TOKEN_SECRET`, `CLIENT_URL`, `ADMIN_PASSWORD`, `CONTACT_EMAILS`, `EMAIL_USER`, `EMAIL_PASS`, `COOKIE_SAMESITE=none`.

Detalle completo en el guía de despliegue del frontend (`DEPLOY-RENDER.md`).
