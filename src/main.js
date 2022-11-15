import { createApp } from 'vue'
import App from './App.vue'
import './main.css';

import { createApolloClient } from '@nhost/apollo'
import { NhostClient } from '@nhost/vue'
import { DefaultApolloClient } from '@vue/apollo-composable'

import { createRouter, createWebHistory } from 'vue-router';

const nhost = new NhostClient({
  subdomain: 'izrmzqtvvesktcetcftg',
  region: 'eu-central-1'
})

const apolloClient = createApolloClient({ nhost })

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue'),
    meta: {
      protected: true,
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// redirecting logic
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.protected)) {
    const isAuthenticated = await nhost.auth.isAuthenticatedAsync()

    if (isAuthenticated) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

createApp(App)
  .provide(DefaultApolloClient, apolloClient)
  .use(nhost)
  .use(router)
  .mount('#app')
