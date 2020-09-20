<template>
  <v-card> 
    <v-alert :type="type" dense v-if="error" dismissible>{{error}}</v-alert>
    <v-card-title>1. Fill multiple collections in the database</v-card-title>
    <v-card-title>2. You can also create a sigle item with and option to upload a picture</v-card-title>
    <v-card-text>
     
      <p>fill database.js to populate multiple collections and single.js to populate a collection. The latter gives an option to upload image</p>
    </v-card-text>
    <v-card-actions>
      <v-btn :loading="fillLoading" color="primary" @click="createItems">Fill Collections</v-btn>
      <v-btn :loading="itemLoading" color="primary" @click="createItem">Create Item</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import single from "../../assets/single.js";
import collections from "../../assets/collections.js";

export default {
  data() {
    return {
      fillLoading: false,
      itemLoading: false,
      error: "",
      type: "error"
    };
  },
  methods: {
    async createItems() {
      try {
        this.fillLoading = true;
        await this.$store.dispatch("createItems", {
          items: collections
        });
        this.type = "success";
        this.error = "User was added successfully";
        this.fillLoading = false;
      } catch (error) {
        this.type = "error";
        this.error = error.message;
        this.fillLoading = false;
      }
    },
    async createItem() {
      try {
        this.itemLoading = true;
        let item = await this.$store.dispatch("createItem", {
          collection: single.collection,
          single: single.single,
          item: single.item
        });

        if (single.single) {
          this.$emit("image", {
            id: single.collection,
            collection: single.collection
          });
        } else {
          this.$emit("image", { id: item.id, collection: single.collection });
        }
        this.$emit("show");
        this.type = "success";
        this.error = "User was added successfully";
        this.itemLoading = false;
      } catch (error) {
        console.log(error);
        this.type = "error";
        this.error = error.message;
        this.itemLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>