import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import api from './config/axios'

import { Quasar, Notify } from 'quasar'
import quasarLang from 'quasar/lang/es' // Idioma
import '@quasar/extras/material-icons/material-icons.css'

// Estilos de Quasar (usa Sass)
import './assets/main.css'
import 'quasar/src/css/index.sass'

const app = createApp(App)

app.config.globalProperties.$api = api
const savedTheme = localStorage.getItem('user-theme')
const isDark = savedTheme === 'dark'

app.use(createPinia())
app.use(router)

app.use(Quasar, {
  config: {
    dark: isDark,
  },
  plugins: {
    Notify,
  }, // Agregá aquí Notify, Dialog, etc. si los necesitás
  lang: quasarLang,
})

app.mount('#app')
