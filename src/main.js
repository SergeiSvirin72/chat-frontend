import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

/* BootstrapVue */
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)

import InfiniteLoading from 'vue-infinite-loading';

Vue.use(InfiniteLoading, { /* options */ });

Vue.config.productionTip = false

/* Axios */
import axios from 'axios'

window.axios = axios
axios.defaults.baseURL = 'http://chat.dev:8000'
axios.defaults.withCredentials = true
axios.interceptors.response.use(
  response => response, 
  error => {
    if ((error.response.status == 401 || error.response.status == 419)
      && store.state.user) {
      localStorage.setItem('guest', true)
      store.commit('setUser', null)
      router.push('/login')
    }
    return Promise.reject(error)
  }
);

/* LaravelEcho */
import Echo from "laravel-echo"

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: 'key',
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
    authorizer: (channel, options) => {
      return {
          authorize: (socketId, callback) => {
              axios.post('/api/broadcasting/auth', {
                  socket_id: socketId,
                  channel_name: channel.name
              })
              .then(response => {
                  callback(false, response.data);
              })
              .catch(error => {
                  callback(true, error);
              });
          }
      };
  },
});

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
