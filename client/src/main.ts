import Vue, { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import VueAxios from 'vue-axios';
import axios from 'axios';
// import GAuth from 'vue-google-oauth2';
import vue3GoogleLogin from 'vue3-google-login';
const app = createApp(App);
const options = {
  confirmButtonColor: '#41b882',
  cancelButtonColor: '#ff7674',
};

const googleOption = {
  clientId:
    '466822532146-adhthi16ea4bm0qlcvkfbku4d2m1667r.apps.googleusercontent.com',
  scope: 'profile email',
  // prompt: 'select_account',
};

app
  .use(router)
  .use(vue3GoogleLogin, googleOption)
  .use(VueAxios, axios)
  .use(store)
  .use(VueSweetalert2, options)
  .use(vuetify)
  .mount('#app');
