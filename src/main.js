import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
// import store from './store'

createApp(App).use(router).use(autoAnimatePlugin).mount('#app')