import App from '@/views/App.vue';
import router from '@/router/router';
import PrimeVue from 'primevue/config';
import { i18n } from '@/config/i18n';
import { createApp } from 'vue';
import Ripple from 'primevue/ripple';

import 'primevue/resources/themes/aura-dark-noir/theme.css'


/* Create the application */
const app = createApp(App);

/* Bind the application plugins */
app.use(router);
app.use(PrimeVue);
app.use(i18n);

/* Bind app directives */
app.directive('ripple', Ripple);

/* Mount the app */
app.mount('#app');
