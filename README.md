# Portafolio — Backend (API + web)

API Express que también puede servir el frontend (build de Vite en `dist/`).

## Arranque local (solo API)

```bash
npm install
cp .env.example .env
npm run dev
```

## Build del frontend → `backend/dist`

Con ambos repos hermanos (`Portafolio/frontend` y `Portafolio/backend`):

```bash
cd backend
npm run build
```

Eso ejecuta `npm run build` en el front con `VITE_API_URL=/api` y copia el resultado a `backend/dist`.

Luego:

```bash
npm start
```

Abre `http://localhost:5000` — API en `/api` y la web en `/`.

## Render (un solo Web Service)

1. Corre `npm run build` en local para generar `dist/`.
2. Sube el repo backend **incluyendo `dist/`**.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. `CLIENT_URL=https://tu-servicio.onrender.com`
6. `COOKIE_SAMESITE=lax` (mismo origen)

Health: `GET /api/health`
