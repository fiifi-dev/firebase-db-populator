
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12" md="6">
        <div>
          <app-add-item v-if="show" @image="nextComponent"></app-add-item>
          <app-picture :id="id" :collection="collection" @show="show = true" v-else></app-picture>
        </div>
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <app-add-items></app-add-items>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppAddItem from "../components/database/AppAddItem";
import AppAddItems from "../components/database/AppAddItems";
import AppPicture from "../components/general/AppPicture";

export default {
  name: "AppAccount",
  data() {
    return {
      id: "",
      collection: "",
      show: true
    };
  },
  components: {
    AppAddItems,
    AppAddItem,
    AppPicture
  },
  methods: {
    nextComponent(val) {
      this.id = val.id;
      this.collection = val.collection;
      this.show = false;
    }
  }
};
</script>