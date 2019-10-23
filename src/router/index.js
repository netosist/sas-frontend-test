import Vue from 'vue'
import Router from 'vue-router'
import Categories from '@/components/Categories'
import Question from '@/components/Question'
import Report from '@/components/Report'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Categories',
      component: Categories
    },
    {
      path: '/question/:id',
      name: 'Question',
      component: Question
    },
    {
      path: '/report/:id',
      name: 'Report',
      component: Report
    }
  ]
})
