
<template>
  <v-app>
    <v-main class=" lighten-3">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12" sm="8" md="6" lg="4">
            <h1 class="display-4">Coming soon.</h1>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>
