<template>
    <v-container>
        <!-- make two cols one for search and the other for display -->
        <v-col
        width="50%">
            <!-- this col will contain the search feature -->
            <div>
                <v-data-table
                :headers="headers"
                :items="recipes"
                item-key="name"
                :search="search"
                hide-default-footer>
                    <template v-slot:header>
                        <!-- make a search bar -->
                        <v-toolbar>
                            <v-text-field
                            v-model="search"
                            prepend-inner-icon="mdi-magnify"
                            >
                            </v-text-field>
                        </v-toolbar>
                    </template>
                </v-data-table>
            </div>
        </v-col>
        <v-col>
            <!-- this col will contain the highlighted recipe -->
            <v-card>
                <v-card-title>Highlighted Recipe Name</v-card-title>
                <v-card-text>
                    <v-row>
                        <v-sheet>
                            <v-card-title>Discripiton</v-card-title>
                            <v-card-text>
                                <p>text will go here</p>
                            </v-card-text>
                        </v-sheet>
                    </v-row>
                    <v-divider></v-divider>
                    <v-row>
                        <v-col>
                            <v-sheet
                            color="grey">
                                <v-card-title>Ingredients</v-card-title>
                                <v-card-text>
                                    <p>A checkable list of ingredients will go here</p>
                                </v-card-text>
                            </v-sheet>
                        </v-col>
                        <v-col>
                            <v-sheet>
                                <v-card-title>Instructions</v-card-title>
                                <v-card-text>
                                    <p>A checkable list of instructions will go here</p>
                                </v-card-text>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-col>
    </v-container>
</template>

<script>
  export default {
    data () {
      return {
        search: '',
        calories: '',
        recipes: [],
      }
    },
    created(){
      this.initialize()
    },
    methods: {
        initialize(){
          
        }
    },
    computed: {
      headers () {
        return [
          {
            text: 'Recipe',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          {
            text: 'Calories',
            value: 'calories',
            filter: value => {
              if (!this.calories) return true

              return value < parseInt(this.calories)
            },
          },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Iron (%)', value: 'iron' },
        ]
      },
    },
  }
</script>

<style>

</style>