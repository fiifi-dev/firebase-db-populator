<template>
  <ValidationObserver v-slot="{ invalid }">
    <v-card class="py-4">
      <v-card-title class="subtitle-1">Add A Single User</v-card-title>
      <v-card-text>
        <v-alert :type="type" dense v-if="error" dismissible>{{error}}</v-alert>
        <ValidationProvider name="displayName" rules="required" v-slot="{ errors }">
          <v-text-field
            name="displayName"
            label="Name"
            prepend-inner-icon="mdi-account-outline"
            v-model="user.displayName"
            :error-messages="errors"
            required
          ></v-text-field>
        </ValidationProvider>
        <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
          <v-text-field
            name="email"
            prepend-inner-icon="mdi-email-outline"
            v-model="user.email"
            :error-messages="errors"
            type="email"
            required
          ></v-text-field>
        </ValidationProvider>

        <ValidationProvider name="password" rules="required" v-slot="{ errors }">
          <v-text-field
            name="password"
            prepend-inner-icon="mdi-lock-outline"
            v-model="user.password"
            :error-messages="errors"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            @click:append="showPassword = !showPassword"
            required
          ></v-text-field>
        </ValidationProvider>
        <ValidationProvider name="role" rules="required" v-slot="{ errors }">
          <v-select
            v-model="user.role"
            :items="roles"
            label="Role"
            hide-details
            :error-messages="errors"
            required
          ></v-select>
        </ValidationProvider>
      </v-card-text>

      <v-card-actions>
        <v-btn
          :loading="loading"
          color="primary"
          :disabled="invalid"
          :dark="!invalid"
          @click="createUser"
        >Next</v-btn>
      </v-card-actions>
    </v-card>
  </ValidationObserver>
</template>

<script>
export default {
  data() {
    return {
      showPassword: false,
      loading: false,
      error: "",
      type: "error",
      user: {
        displayName: "",
        email: "",
        password: "",
        role: "normal"
      },
      roles: ["normal", "moderator", "admin"]
    };
  },
  methods: {
    async createUser() {
      try {
        this.loading = true;
        let user = await this.$store.dispatch("createUser", this.user);
        this.type = "success";
        this.error = "User was added successfully";
        this.$emit("image", {
          id: user.data.uid,
          collection: "users"
        });
        this.$emit("show");
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