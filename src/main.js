import { createApp } from 'vue'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import router from './router'
import store from './store'
import './assets/main.css'

const app = createApp(App)

app.use(PrimeVue)
app.use(router)
app.use(store)

app.mount('#app')