import Vue from 'vue'
import Router from 'vue-router'
import Result from '@/components/Result.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/search',
      name: 'Search',
      component: Result,
      props: (to) => ({ q: to.query.q })
    }
  ]
})
