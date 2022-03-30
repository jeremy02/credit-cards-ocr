import Vue from 'vue'
import Router from 'vue-router'
const Face = () => import('@/components/Face.vue')
const CreditCard = () => import('@/components/CreditCard.vue')
const LearnComputed = () => import('@/components/learning/LearnComputed.vue')


Vue.use(Router)

export default new Router({
   mode: 'history',
  routes: [
    {
      path: '/',
      name: 'CreditCard',
      component: CreditCard
    },
    {
      path: '/face',
      name: 'Face',
      component: Face
    }
  ]
})
