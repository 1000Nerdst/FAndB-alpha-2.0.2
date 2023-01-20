<template>
  <v-row justify="space-around">
    <v-col cols="auto">
      <v-dialog
        transition="dialog-bottom-transition"
        value="true"
        max-width="600"
      >
        <!-- <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            v-bind="attrs"
            v-on="on"
          >From the bottom</v-btn>
        </template> -->
        <template v-slot:default="dialog">
          <v-card>
            <!-- <v-toolbar
              color="primary"
              dark
            >Opening from the bottom</v-toolbar> -->
            <v-card-text>
              <div class="text-h6 pa-12 justify-center">Analysis Comming Soon</div>
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                text
                @click="dialog.value = false"
              >Close</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>

   
  </v-row>
</template>