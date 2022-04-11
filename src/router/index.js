import Vue from 'vue'
import Router from 'vue-router'

const CreditCard = () => import('@/components/CreditCard.vue')

Vue.use(Router)

export default new Router({
   mode: 'history',
  routes: [
    {
      path: '/',
      name: 'CreditCard',
      component: CreditCard
    }
  ]
})
