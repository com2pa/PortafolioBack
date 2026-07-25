# Backend — Portafolio API

API REST con Express, JWT y MongoDB Atlas.

## Arranque

```bash
npm install
npm run dev
```

Servidor: `http://localhost:5000`

## Variables (`.env`)

Copia `.env.example` a `.env` y completa:

- `MONGO_URI_TEST`
- `ACCESS_TOKEN_SECRET`
- `CLIENT_URL`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`

## Estructura

```
src/
  app.js                 # Express app
  server.js              # Bootstrap
  config/                # Env + DB
  models/                # Mongoose
  services/              # Lógica de negocio + http.client (Axios)
  controllers/           # Handlers HTTP
  routes/                # Rutas API
  middleware/            # Auth, upload, errors
  seed/                  # Datos iniciales
  utils/                 # Helpers
```

El frontend consume esta API con **Axios**. El backend también incluye `services/http.client.js` (Axios) para llamadas HTTP salientes.

## Endpoints

| Método | Ruta | Auth |
|--------|------|------|
| GET | `/api/health` | No |
| POST | `/api/auth/login` | No |
| GET | `/api/auth/me` | Sí |
| GET | `/api/projects` | No |
| POST | `/api/projects` | Sí |
| PUT | `/api/projects/:id` | Sí |
| DELETE | `/api/projects/:id` | Sí |
