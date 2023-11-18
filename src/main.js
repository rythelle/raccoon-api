import { createApp } from 'vue';
import App from './App.vue';

import PrimeVue from 'primevue/config';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/themes/bootstrap4-light-blue/theme.css';

import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';

import './style.css';

const app = createApp(App);

app.use(PrimeVue);
app.use(ToastService);
app.component('Toast', Toast);

app.mount('#app');
