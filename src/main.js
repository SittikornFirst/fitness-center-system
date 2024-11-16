import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import TheHeader from "./components/layout/TheHeader.vue";
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'


const app = createApp(App);

app.use(router);
app.component("TheHeader", TheHeader);
app.mount("#app");