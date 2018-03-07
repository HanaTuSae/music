// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import store from './vuex/store'
import 'normalize.css'
import 'animate.css'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.min.css'
// import { Loadmore,Spinner } from 'mint-ui';

Vue.config.productionTip = false
Vue.use(VueAxios,axios);
axios.defaults.baseURL='http://music.hanatusae.xin/music2';//当项目不是在根目录时设置基础路径
Vue.use(Vuex);
Vue.use(MintUI);
Vue.use(VueAwesomeSwiper);
// Vue.component(Loadmore.name, Loadmore);
// Vue.component(Spinner.name, Spinner);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
