import Router from 'vue-router'
import Vue from 'vue'
import store from '../store'
import { apolloClient } from '../apollo'
import { GET_ROLES } from '@/graphql/role'

const HelloWorld = () => import('@/views/HelloWorld')
const Home = () => import('@/views/Home')
const Login = () => import('@/views/Login')
const Dash = () => import('@/components/layout/dash')
const NotFound = () => import('@/views/404')

// routes
import masterRoutes from './master'
import userMgmtRoutes from './user-management'
import edpRoutes from './edp'
import admissionRoutes from './admission'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Dash,
      children: [
        {
          path: '',
          name: 'home',
          component: Home,
          name: 'Home',
          meta: {
            breadcrumbs: ['Home'],
            caption: 'Home'
          }
        },
        {
          path: 'hello',
          component: HelloWorld,
          name: 'Hello',
          meta: {
            breadcrumbs: ['Home', 'Hello'],
            caption: 'Hello',
            privilege: 'admin'
          }
        },
        ...admissionRoutes,
        ...edpRoutes,
        ...userMgmtRoutes,
        ...masterRoutes
      ]
    },
    {
      path: '*',
      name: 'notfound',
      component: NotFound
    }
  ],
  mode: 'history',
  linkExactActiveClass: 'is-active'
})

router.beforeEach((to, from, next) => {
  if (to.name == 'login' || to.name == 'notfound')
    return next();
  apolloClient.query({
    query: GET_ROLES
  }).then(console.log)

  if (store.state.auth) {
    const remainingMiliseconds = store.state.auth.expiresIn - new Date().getTime();
    console.log('remainingMiliseconds', remainingMiliseconds)
    if (remainingMiliseconds > 1000 && remainingMiliseconds < 570000) {
      store.state.refresh = true;
    }
    if (remainingMiliseconds < 0) {
      next('login')
    }
    const privileges = store.state.auth.privileges.split(',');
    if (!to.meta.privilege || privileges.includes('admin') || privileges.includes(to.meta.privilege))
      return next()
  }
  if (from.name) {
    alert('access-denied');
    return next(from)
  }
  next('login')
})

export default router

