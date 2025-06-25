import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Tu endpoint base
  timeout: 15000, // Aumenté el timeout a 15 segundos
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Interceptor para añadir token de autenticación si existe
api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  const token = authStore.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response.data, // Devuelve solo los datos
  (error) => {
    // Manejo personalizado de errores
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Redirige a login si no autorizado
          if (window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          break
        case 403:
          console.error('Acceso prohibido')
          break
        case 404:
          console.error('Recurso no encontrado')
          break
        case 500:
          console.error('Error del servidor')
          break
        default:
          console.error('Error desconocido')
      }
    }
    return Promise.reject(error)
  },
)

export default api
