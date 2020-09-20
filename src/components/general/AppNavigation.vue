
<template>
  <div>
    <v-navigation-drawer v-model="drawer" app color="primary" dark>
      <v-list dense>
        <v-list-item>
          <v-list-item-content class="button">DB Populator</v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-list-group v-model="profileItem.active" color="white">
          <template v-slot:activator>
            <v-list-item-action class="mr-2">
              <v-avatar size="38" class="grey">U</v-avatar>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="subtitle-2">{{ user.displayName || "User" }}</v-list-item-title>
              <v-list-item-subtitle class="caption">{{ user.email || "" }}</v-list-item-subtitle>
            </v-list-item-content>
          </template>

          <v-list-item
            v-for="subItem in profileItem.items"
            :key="subItem.title"
            :to="subItem.to"
            exact
            link
          >
            <v-list-item-action class="mr-2 ml-4">
              <v-icon>{{ subItem.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title" class="overline"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="signOut">
            <v-list-item-action class="mr-2 ml-4">
              <v-icon>mdi-power</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="overline">Sign Out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-divider></v-divider>
        <v-list-item link v-for="item in navItems" :key="item.title" :to="item.to" exact>
          <v-list-item-action class="mr-3">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="overline">
              {{
              item.title
              }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-divider v-if="$vuetify.breakpoint.mobile"></v-divider>
        <div v-if="$vuetify.breakpoint.mobile">
          <v-list-item link v-for="item in dashboardItems" :key="item.title" :to="item.to" exact>
            <v-list-item-action class="mr-3">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="overline">
                {{
                item.title
                }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app color="white">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-avatar size="38" v-bind="attrs" v-on="on" class="grey white--text">U</v-avatar>
        </template>
        <v-list>
          <v-list-item link v-for="(item, index) in dropdownItems" :key="index" :to="item.to" exact>
            <v-list-item-action class="mr-3">
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="overline">
                {{
                item.title
                }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link @click="signOut">
            <v-list-item-action class="mr-3">
              <v-icon>mdi-power</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="overline">Sign Out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>
  
  <script>
import { auth } from "firebase";
export default {
  data() {
    return {
      signOutSnackbar: false,
      signOutSnackbarText: "Error occured: Try again",
      drawer: null,
      claims: {
        moderator: false,
        admin: false,
        auth: false
      },
      navItems: [
        { title: "Overview", to: { name: "home" }, icon: "mdi-home-outline" },
        { title: "Account", to: { name: "account" }, icon: "mdi-account" },
        { title: "Database", to: { name: "database" }, icon: "mdi-database" }
      ],
      dropdownItems: [
       
      ],
      dashboardItems: [],
      profileItem: {
        active: false,
        items: [
        
        ]
      }
    };
  },
  async created() {
    await this.getClaims();
  },
  computed: {
    user() {
      if (auth().currentUser) {
        return auth().currentUser;
      } else {
        return {};
      }
    },
    altName() {
      if (auth().currentUser && auth().currentUser.displayName) {
        return auth()
          .currentUser.displayName.trim()
          .slice(0, 1)
          .toUpperCase();
      } else {
        return "";
      }
    }
  },
  methods: {
    async getClaims() {
      let user = auth().currentUser;
      if (user) {
        let claims = (await user.getIdTokenResult()).claims;
        this.claims.moderator = claims.moderator;
        this.claims.admin = claims.admin;
        this.claims.auth = true;
      }
    },
    async signOut() {
      try {
        await this.$store.dispatch("signOut");

        await this.$router.push({ name: "login" });
      } catch (err) {
        this.signInSnackbarText = err;
        this.signInSnackbar = true;
      }
    }
  }
};
</script>
  