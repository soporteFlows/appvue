<template>
  <q-layout view="hHh lpr fFf">
    <!-- Header -->
    <q-header bordered>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <img alt="Quasar logo" style="width: 50px" src="/public/logo.25a7686d.png" />

          ALOÑA
        </q-toolbar-title>

        <q-space />

        <!-- Dark mode toggle -->
        <q-btn
          flat
          dense
          :icon="$q.dark.isActive ? 'light_mode' : 'dark_mode'"
          @click="toggleDarkMode"
        />

        <!-- User dropdown -->
        <q-btn-dropdown flat dense :label="userName" icon="account_circle">
          <q-list>
            <q-item clickable @click="goToChangePassword">
              <q-item-section>Cambiar contraseña</q-item-section>
            </q-item>
            <q-item clickable @click="logout">
              <q-item-section>Cerrar sesión</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <!-- Sidebar (opcional) -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState"
      @mouseenter="miniState = false"
      @mouseleave="miniState = true"
      mini-to-overlay
      :width="200"
      :breakpoint="500"
      bordered
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
    >
      <q-list>
        <q-item-label header>Menú</q-item-label>
        <q-item clickable v-ripple to="/dashboard">
          <q-item-section avatar>
            <q-icon name="dashboard" />
          </q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <!-- Más opciones de menú... -->
      </q-list>
    </q-drawer>

    <!-- Contenido principal -->
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <!-- Footer (opcional) -->
    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title class="text-center"> &copy; 2024 ALOÑA </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '@/stores/authStore'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()
const leftDrawerOpen = ref(false)
const miniState = ref(true)

const userName = authStore.username

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const toggleDarkMode = () => {
  $q.dark.toggle()
  localStorage.setItem('dark-mode', $q.dark.isActive ? 'true' : 'false')
}

const logout = () => {
  authStore.clearToken()
  $q.notify({ type: 'info', message: 'Sesión cerrada', position: 'top' })
  router.push('/login')
}

const goToChangePassword = () => {
  router.push('/cambiar-contrasena')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
