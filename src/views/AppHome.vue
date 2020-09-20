
<template>
  <div>
    <app-navigation> </app-navigation>
    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
</template>

<script>
import AppNavigation from "../components/general/AppNavigation.vue";

export default {
  data() {
    return {};
  },
  components: {
    AppNavigation,
  },
};
</script>
