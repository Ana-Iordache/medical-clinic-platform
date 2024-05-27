import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import router from './router'
import axiosPlugin from './plugins/axios'
import pinia from './plugins/pinia';
import initilizeFirebase from './plugins/firebase'
import socketPlugin from './plugins/socketIo'

loadFonts()

// NOTE: you should create a file 'firebase.js' in 'plugins' folder with details metioned in 'firebase_template.js'
initilizeFirebase()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(axiosPlugin)
  .use(pinia)
  .use(socketPlugin)
  .mount('#app')
