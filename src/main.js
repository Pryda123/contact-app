import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import store from './store'

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  store,
  created() {
    const user = sessionStorage.getItem('user');
    if(user) {
      this.$store.commit('setUser', JSON.parse(user));
    }
  },
  render: h => h(App)
}).$mount('#app')
