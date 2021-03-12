import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '',
    component: () => import('../layouts/Default.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '/',
        component: () => import('../views/General.vue'),
      },
      {
        path: '/messages',
        component: () => import('../views/Messages.vue'),
      }
    ]
  },
  {
    path: '',
    component: () => import('../layouts/Guest.vue'),
    meta: { guest: true },
    children: [
      {
        path: '/login',
        component: () => import('../views/Login.vue'),
      },
      {
        path: '/register',
        component: () => import('../views/Register.vue'),
      }
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      axios.get('/api/user')
        .then(response => {
          localStorage.setItem('guest', false)
          store.commit('setUser', response.data)
          next() 
        })
        .catch(error => {
          localStorage.setItem('guest', true)
          store.commit('setUser', null)
          next('/login')
        })
    } else  {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (!store.state.user) {
      axios.get('/api/user')
        .then(response => { 
          localStorage.setItem('guest', false)
          store.commit('setUser', response.data)
          next('/') 
        })
        .catch(error => {
          localStorage.setItem('guest', true)
          store.commit('setUser', null)
          next()
        })
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router
