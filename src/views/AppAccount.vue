
<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12" md="6">
        <div>
          <app-add-user @image="nextComponent" v-if="show"></app-add-user>
          <app-picture :id="id" :collection="collection" v-else @show="show = true"></app-picture>
        </div>
      </v-col>
      <v-col cols="12" sm="12" md="6">
        <app-add-users></app-add-users>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AppAddUser from "../components/account/AppAddUser";
import AppAddUsers from "../components/account/AppAddUsers";
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
    AppAddUser,
    AppAddUsers,
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