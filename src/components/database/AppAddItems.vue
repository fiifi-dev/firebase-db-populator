<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-card class="py-4">
      <v-card-title class="subtitle-1">Add Multiple Items to the database with a csv file</v-card-title>
      <v-card-text>
        <v-alert :type="type" dense v-if="error" dismissible>{{error}}</v-alert>

        <ValidationProvider name="collection" rules="required|alpha" v-slot="{ errors }">
          <v-text-field
            name="collection"
            label="Collection"
            v-model="collection"
            prepend-inner-icon="mdi-database"
            :error-messages="errors"
            required
          ></v-text-field>
        </ValidationProvider>

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
          @click="fillDatabaseCSV"
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
      file: null,
      collection: ""
    };
  },
  methods: {
    async fillDatabaseCSV() {
      try {
        this.loading = true;
       await this.$store.dispatch("fillDatabaseCSV", {
          collection: this.collection,
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