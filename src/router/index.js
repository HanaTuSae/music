import Vue from 'vue'
import Router from 'vue-router'
// import Footer from '@/components/Footer'
// import MusicList from '../components/MusicList.vue'
// import Recommend from '../components/Recommend.vue'
// import Read from '../components/Read.vue'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'linkActive',
  mode: 'history',
  base: __dirname,
  routes: [
    // {
    //   path: '/',
    //   name: 'Hello',
    //   component: Hello
    // },
    {
      path: '/',
      name: '/',
      component: resolve => require(['../components/MusicList.vue'], resolve)
    },
    {
      path: '/musiclist',
      name: 'MusicList',
      component: resolve => require(['../components/MusicList.vue'], resolve)
    },

    {
      path: '/recommend',
      name: 'Recommend',
      component: resolve => require(['../components/Recommend.vue'], resolve)
    },
    {
      path: '/read',
      name: 'Read',
      component: resolve => require(['../components/Read.vue'], resolve)
    },
    { path: '/',
        redirect: resolve => require(['../components/MusicList.vue'], resolve)
    }
  ]
})
