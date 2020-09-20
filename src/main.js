
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import validate from "./plugins/validate";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  validate,
  render: (h) => h(App),
}).$mount("#app");
