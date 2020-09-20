
<template>
  <v-app>
    <v-main class="primary lighten-3">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="text-center" cols="12" sm="8" md="6" lg="4">
            <ValidationObserver v-slot="{ invalid }">
              <v-card class="py-4">
                <v-card-text>
                  <div class="overline">Log in</div>
                  <ValidationProvider
                    name="email"
                    rules="required|email"
                    v-slot="{ errors }"
                  >
                    <v-text-field
                      name="email"
                      prepend-inner-icon="mdi-email-outline"
                      v-model="user.email"
                      :error-messages="errors"
                      type="email"
                      @click:append="showPassword = !showPassword"
                      required
                    ></v-text-field>
                  </ValidationProvider>

                  <ValidationProvider
                    name="email"
                    rules="required"
                    v-slot="{ errors }"
                  >
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
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    :loading="signInLoading"
                    color="primary"
                    block
                    :disabled="invalid"
                    :dark="!invalid"
                    @click="signIn"
                    >Login</v-btn
                  >
                </v-card-actions>
              </v-card>
            </ValidationObserver>
          </v-col>
        </v-row>
      </v-container>
      <v-snackbar v-model="signInSnackbar">
      {{ signInSnackbarText }}
      <v-btn color="pink" text bottom right @click="signInSnackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      showPassword: false,
      signInLoading: false,
      signInSnackbar: false,
      signInSnackbarText: "Error occured: Try again",
      user: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async signIn() {
      try {
        this.signInLoading = true;
        await this.$store.dispatch("signIn", this.user);

        //load all database here
        // await Promise.all([
        //   this.$store.dispatch("bindAdministrators"),
        // ]);

        this.$router.push({ name: "home" });
        this.signInLoading = false;
      } catch (err) {
        this.signInSnackbarText = err;
        this.signInSnackbar = true;
        this.signInLoading = false;
      }
    },
  },
};
</script>
