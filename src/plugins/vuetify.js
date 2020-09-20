
import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {"primary":"#1d3557","secondary":"#457b9d","accent":"#a8dadc","error":"#e63946"},
    },
  },
});