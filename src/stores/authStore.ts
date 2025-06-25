// src/stores/authStore.ts
import { defineStore } from 'pinia'
import axios from '@/config/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('auth_token') || '',
    username: localStorage.getItem('auth_username') || '',
    fullName: '', // por ejemplo "CRISTIAN ROQUE CUELLO"
    perfilId: null as number | null,
  }),

  actions: {
    setToken(newToken: string, username: string, perfilId: number) {
      this.token = newToken
      this.username = username
      this.perfilId = perfilId
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('auth_username', username)
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    },

    clearToken() {
      this.token = ''
      this.username = ''
      this.fullName = ''
      this.perfilId = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_username')
      delete axios.defaults.headers.common['Authorization']
    },

    isLoggedIn(): boolean {
      return !!this.token
    },
  },
})
