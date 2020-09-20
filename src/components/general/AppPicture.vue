<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-card class="py-4">
      <v-card-title class="subtitle-1">Upload  Picture</v-card-title>
      <v-card-text>
        <v-alert :type="type" dense v-if="error" dismissible>{{error}}</v-alert>
        <div v-if="src">
          <v-img :src="src" aspect-ratio="1.7"></v-img>
        </div>

        <ValidationProvider name="displayName" rules="required" v-slot="{ errors }">
          <v-file-input
            name="file"
            accept="image/*"
            v-model="file"
            :error-messages="errors"
            required
            label="Upload JSON File"
          ></v-file-input>
        </ValidationProvider>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="$emit('show')">Cancel</v-btn>
        <v-btn
          :loading="loading"
          color="primary"
          @click="uploadFile"
          :disabled="invalid"
          :dark="!invalid"
        >Upload</v-btn>
      </v-card-actions>
    </v-card>
  </ValidationObserver>
</template>

<script>
export default {
  props: ["id", "collection"],
  data() {
    return {
      src: "",
      loading: false,
      error: "",
      type: "error",
      file: null
    };
  },
  watch: {
    file(val) {
      if (val) {
        this.src = URL.createObjectURL(this.file);
      } else {
        this.src = "";
      }
    }
  },
  methods: {
    async uploadFile() {
      try {
        this.loading = true;

        let downloadURL = await this.$store.dispatch("uploadFile", {
          collection: this.collection,
          id: this.id,
          file: this.file
        });

        await this.$store.dispatch("uploadPicture", {
          id: this.id,
          collection: this.collection,
          downloadURL: downloadURL
        });

        this.type = "success";
        this.error = "Picture  was uploaded successfully";
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