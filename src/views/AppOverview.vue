<template>
  <v-container>
    <v-row>
      <v-col cols="12" sm="12" md="6">
        <v-card>
          <v-card-title>Some base instructions</v-card-title>
          <v-card-text>This System Populates your firebase firestore as well as storage. It enables you to have a data to work with during developments. I uses vuetify for the frontend.</v-card-text>
          <v-card-text>
            <v-list>
              <v-list-item># Start by create a firebase project.</v-list-item>
              <v-list-item># Add a user in the firebase auth</v-list-item>
              <v-list-item># Populate the db.js with your project settings</v-list-item>
              <v-list-item># Iniatialize firebase functions and copy the content in this functionIndex to the index.js in the functions folder</v-list-item>
              <v-list-item>
                # Install the following packages: child-process-promise, csvtojson, mkdirp
              </v-list-item>
              <v-list-item># Deploy the functions and you're ready to go</v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>
