import axios from 'axios'
import { env } from '../config/env.js'

/**
 * Cliente Axios del backend para llamadas HTTP salientes
 * (servicios externos, webhooks, email APIs, etc.)
 */
export const http = axios.create({
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'Error en solicitud HTTP saliente'
    return Promise.reject(new Error(message))
  },
)

/** Cliente apuntando al propio frontend (útil para integraciones / pruebas) */
export const frontendHttp = axios.create({
  baseURL: env.clientUrl,
  timeout: 15000,
})
