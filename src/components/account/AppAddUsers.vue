<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-card class="py-4">
      <v-card-title class="subtitle-1">Add Multiple Users</v-card-title>
      <v-card-text>
        <v-alert :type="type" dense v-if="error" dismissible>{{error}}</v-alert>

        <ValidationProvider name="file" rules="required" v-slot="{ errors }">
          <v-file-input
            name="file"
            label="Upload csv file"
            v-model="file"
            prepend-inner-icon="mdi-paperclip"
            prepend-icon
            accept=".csv"
            :error-messages="errors"
            required
          ></v-file-input>
        </ValidationProvider>
      </v-card-text>

      <v-card-actions>
        <v-btn
          :loading="loading"
          color="primary"
          :disabled="invalid"
          :dark="!invalid"
          @click="createUser"
        >Upload</v-btn>
      </v-card-actions>
    </v-card>
  </ValidationObserver>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      error: "",
      type: "error",
      file: null
    };
  },
  methods: {
    async createUser() {
      try {
        this.loading = true;
       await this.$store.dispatch("fillDatabaseCSV", {
          collection: "users",
          file: this.file
        });
        this.type = "success";
        this.error = "User was added successfully";
        this.loading = false;
      } catch (error) {
        this.type = "error";
        this.error = error.message;
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>