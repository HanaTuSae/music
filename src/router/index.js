import Vue from 'vue'
import Router from 'vue-router'
// import Footer from '@/components/Footer'
import MusicList from '../components/MusicList.vue'
import Recommend from '../components/Recommend.vue'
import Read from '../components/Read.vue'

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
      component: MusicList
    },
    {
      path: '/musiclist',
      name: 'MusicList',
      component: MusicList
    },

    {
      path: '/recommend',
      name: 'Recommend',
      component: Recommend
    },
    {
      path: '/read',
      name: 'Read',
      component: Read
    }
  ]
})
