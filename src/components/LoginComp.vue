<template>
  <div>
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <label>
        <input v-model="username" type="text" placeholder="Usuario" required />
      </label>

      <label>
        <input v-model="password" type="password" placeholder="Contraseña" required />
      </label>

      <label>
        <input type="checkbox" v-model="rememberMe" />
        Recordarme
      </label>

      <div>
        <a href="#/auth/forgotPassword">¿Olvidó su contraseña?</a>
      </div>

      <button type="submit" :disabled="loading">
        <i class="fas fa-arrow-right"></i>
        {{ loading ? 'Cargando...' : 'Iniciar' }}
      </button>
    </form>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/config/axios'
import type { AxiosError } from 'axios'
import { useAuthStore } from '@/stores/authStore'
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const error = ref('')
const router = useRouter()

interface ErrorResponse {
  message?: string
  // otras propiedades que pueda tener tu error
}
interface LoginResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  username: string
  roles: string[]
  id: number
}

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const data: LoginResponse = await api.post('/api/login', {
      username: username.value,
      password: password.value,
      rememberMe: rememberMe.value,
    })

    console.log('✅ token:', data) // accedés directamente
    authStore.setToken(data.access_token, data.username, data.id)
    router.push('/dashboard')
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      const errorData = err.response?.data as ErrorResponse
      error.value = errorData?.message || 'Error al iniciar sesión'
      if (err.response?.status === 401) password.value = ''
    } else {
      error.value = 'Error inesperado'
    }
  } finally {
    loading.value = false
  }
}
function isAxiosError(error: unknown): error is AxiosError {
  return (error as AxiosError).isAxiosError !== undefined
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  align-self: flex-end;
}

.respuesta {
  margin-top: 1rem;
  background-color: #e0ffe0;
  padding: 1rem;
  border-radius: 4px;
}

.error {
  margin-top: 1rem;
  background-color: #ffe0e0;
  padding: 1rem;
  border-radius: 4px;
}
</style>
