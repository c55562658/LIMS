import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import "element-ui/lib/theme-chalk/index.css"

//引入mavon-editor
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import './axios.js'
import axios from 'axios'
import './permission.js' // 路由拦截

import './assets/iconfont/iconfont.css';
import './assets/iconfont/iconfont';


Vue.use(Element)
Vue.use(mavonEditor)
Vue.prototype.$axios = axios //

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
