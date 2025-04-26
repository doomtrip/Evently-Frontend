// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// Импорт компонентов PrimeVue
import Button from 'primevue/button';
import Menu from 'primevue/menu';

const app = createApp(App);

app.use(router);
app.use(store);
app.use(PrimeVue);

// Глобальная регистрация компонентов
app.component('Button', Button);
app.component('Menu', Menu);

app.mount('#app');