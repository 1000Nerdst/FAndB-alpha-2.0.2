<template>
    <v-container>
        <!-- make two rows -->
        <v-row >
            <!-- this row will contain meals and verified totals -->
            <v-col>
                <!-- this col will cotain daily planned meals -->
                <!-- make two rows -->
                <v-card
               >
                    <v-row style="margin: 0px;">
                    <!-- this row will contain a date picker and button changer -->
                        <v-menu
                        ref="menu"
                        v-model="menu"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        min-width="auto"
                        >
                        <!-- taken out from above
                        :return-value.sync="date" -->
                            <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                    v-model="date"
                                    label="Picker in menu"
                                    prepend-icon="mdi-calendar"
                                    readonly
                                    v-bind="attrs"
                                    v-on="on"
                                ></v-text-field>
                            </template>
                            <v-date-picker
                            v-model="date"
                            no-title
                            scrollable
                            >
                                <v-spacer></v-spacer>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="menu = false"
                                >
                                    Cancel
                                </v-btn>
                                <v-btn
                                    text
                                    color="primary"
                                    @click="$refs.menu.save(date)"
                                >
                                    OK
                                </v-btn>
                            </v-date-picker>
                        </v-menu>
                    </v-row>
                    <v-row style="margin: 0px;">
                        <!-- this row will display the meal with a check box attached -->
                        <v-expansion-panels
                        v-model="panel"
                        multiple
                        width="100%"
                        >
                            <v-expansion-panel
                                v-for="(item,i) in items"
                                :key="i"
                                width="100"
                            >
                                <v-expansion-panel-header>{{ item }}</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                <!-- checkable table data -->
                                <v-data-table
                                    v-model="selected"
                                    :headers="headers"
                                    :items="desserts"
                                    :single-select="singleSelect"
                                    item-key="name"
                                    show-select
                                    class="elevation-1"
                                    hide-default-footer
                                >
                                    <template v-slot:top>
                                    </template>
                                </v-data-table>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-row>
                </v-card>
            </v-col>
            <!-- <v-col>
              
                <v-sheet>
                    <template>
                            <v-container fluid>
                                <template>
                                    <v-row>
                                    <v-col>
                                        <v-card>
                                        <v-card-title>
                                            <h4>Values</h4>
                                        </v-card-title>
                                        <v-divider></v-divider>
                                        <v-list
                                        dense
                                        >
                                            <v-list-item>
                                            <v-list-item-content>Calories:</v-list-item-content>
                                            <v-list-item-content class="align-end">
                                                0
                                            </v-list-item-content>
                                            </v-list-item>
                                            <v-list-item>
                                            <v-list-item-content>Fat:</v-list-item-content>
                                            <v-list-item-content class="align-end">
                                                0
                                            </v-list-item-content>
                                            </v-list-item>
                                            <v-list-item>
                                            <v-list-item-content>Carbs:</v-list-item-content>
                                            <v-list-item-content class="align-end">
                                                0
                                            </v-list-item-content>
                                            </v-list-item>
                                            <v-list-item>
                                            <v-list-item-content>Protein:</v-list-item-content>
                                            <v-list-item-content class="align-end">
                                                0
                                            </v-list-item-content>
                                            </v-list-item>
                                        </v-list>
                                        </v-card>
                                    </v-col>
                                    </v-row>
                                </template>
                            </v-container>
                        </template>
                </v-sheet>
            </v-col> -->
        </v-row>
        <v-row style="margin: 20px 0px;">
            <!-- this row will contain  planned totals-->
            <v-card
            width="100%">
                <v-card-title>
                    <h3>Planned Totals</h3>
                </v-card-title>
                <v-row>
                    <v-col>
                        <v-list>
                            <v-list-item>
                                <v-list-item-content>Calories</v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>0</v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-col>
                        <v-list>
                            <v-list-item>
                                <v-list-item-content>Protein</v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>0</v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-col>
                        <v-list>
                            <v-list-item>
                                <v-list-item-content>Carbs</v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>0</v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>
                    <v-col>
                        <v-list>
                            <v-list-item>
                                <v-list-item-content>Fats</v-list-item-content>
                            </v-list-item>
                            <v-list-item>
                                <v-list-item-content>0</v-list-item-content>
                            </v-list-item>
                        </v-list>
                    </v-col>
                </v-row>
            </v-card>
        </v-row>
    </v-container>
</template>

<script>
  export default {
    data () {
        return {
            panel: [],
            items: ["Breakfast", "Lunch", "Dinner", "Snacks"],
            singleSelect: false,
            selected: [],
            headers: [
            {
                text: 'Dessert (100g serving)',
                align: 'start',
                sortable: false,
                value: 'name',
            },
            { text: 'Calories', value: 'calories' },
            { text: 'Fat (g)', value: 'fat' },
            { text: 'Carbs (g)', value: 'carbs' },
            { text: 'Protein (g)', value: 'protein' },
            ],
            desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
            fat: 6.0,
            carbs: 24,
            protein: 4.0,
            iron: '1%',
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
            fat: 9.0,
            carbs: 37,
            protein: 4.3,
            iron: '1%',
          },
          {
            name: 'Eclair',
            calories: 262,
            fat: 16.0,
            carbs: 23,
            protein: 6.0,
            iron: '7%',
          },
          {
            name: 'Cupcake',
            calories: 305,
            fat: 3.7,
            carbs: 67,
            protein: 4.3,
            iron: '8%',
          },],
        }
    },
    methods: {
      // Create an array the length of our items
      // with all values as true
      all () {
        this.panel = [...Array(this.items).keys()].map((k, i) => i)
      },
      // Reset the panel
      none () {
        this.panel = []
      },
    },
  }
</script>

<style>

</style>