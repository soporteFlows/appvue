<template>
  <div>
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <!-- Usuario -->
      <label>
        <input v-model="username" type="text" placeholder="Usuario" required />
      </label>

      <!-- Contraseña -->
      <label>
        <input v-model="password" type="password" placeholder="Contraseña" required />
      </label>

      <!-- Recordarme -->
      <label>
        <input type="checkbox" v-model="rememberMe" />
        Recordarme
      </label>

      <!-- Enlace para recuperar contraseña -->
      <div>
        <a href="#/auth/forgotPassword">¿Olvidó su contraseña?</a>
      </div>

      <!-- Botón de inicio -->
      <button type="submit"><i class="fas fa-arrow-right"></i> Iniciar</button>
    </form>

    <!-- Mostrar respuesta -->
    <div v-if="respuesta" class="respuesta">
      <pre>{{ respuesta }}</pre>
    </div>

    <div v-if="error" class="error">
      <pre>{{ error }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const rememberMe = ref(false)

const respuesta = ref('')
const error = ref('')

const route = useRoute()
const router = useRouter()

// Login automático si viene desde Jasper con los parámetros
onMounted(() => {
  const user = route.query.j_username as string
  const pass = route.query.j_password as string

  if (user && pass) {
    username.value = user
    password.value = pass
    handleLogin()
  }
})

const handleLogin = async () => {
  respuesta.value = ''
  error.value = ''

  try {
    const res = await fetch('https://api.flowsma.com/donandres/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
        rememberMe: rememberMe.value,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Error al iniciar sesión')
    }

    respuesta.value = JSON.stringify(data, null, 2)

    // Opcional: redirigís a una página protegida
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message
  }
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
