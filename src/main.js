import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueElectron from 'vue-electron'
import Axios from 'axios';
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'

Vue.config.productionTip = false

Vue.use(VueElectron)
Vue.use(VueCodemirror);


Axios.defaults.baseURL = ''
Axios.defaults.timeout = 10000

/**
 * 请求拦截器
 */
Axios.interceptors.request.use(
    config => {
      // 允许携带cookie
      config.withCredentials = true;
      config.headers['Content-Type'] = "application/json";
      config.headers['token'] = window.localStorage.getItem("token");
      return config
    },
    error => {
      return Promise.error(error)
    }
)

/**
 * 相应拦截器
 */
Axios.interceptors.response.use(
    response => {
      if (response.status === 200) {
        return Promise.resolve(response.data.responseBody)
      } else {
        return Promise.reject(response)
      }
    },
    // 服务器状态码不是200的情况
    error => {
      console.log(error)
      try {
        if (error.response.status) {
          if (error.response.status === 401) {
            router.replace({
              path: '/login'
            })
          } else if (error.response.status === 400) {
            alert(error.response.data.message)
          } else {
            alert('网络错误，请稍后再试')
          }
          return Promise.reject(error.response)
        }
      }catch (e){
        alert('网络错误，请稍后再试')
        return Promise.reject(error.response)
      }
    }
)
Vue.prototype.ser = Axios
Vue.prototype.ser.ctx = Axios.defaults.baseURL

/**
 * 全局路由跳转
 * @param path
 *      跳转路径
 * @param replace
 *      是否直接更换
 */
Vue.prototype.go = (path, replace) => {
  if (replace) {
    router.replace({
      path: path
    });
  } else {
    router.push({
      path: path
    });
  }
}


/**
 * 全局UUID
 * @returns {string}
 */
Vue.prototype.uuid = () => {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";
  let uuid = s.join("");
  return uuid.replace("-", "");
}


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
