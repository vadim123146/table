import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Обработка ошибок в production
if (import.meta.env.PROD) {
  app.config.errorHandler = (err) => {
    console.error('App Error:', err)
  }
}

app.mount('#app')