import Vue from 'vue'
import VueRouter from 'vue-router'
import ContactList from '../views/ContactList.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'contacts',
    component: ContactList
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router