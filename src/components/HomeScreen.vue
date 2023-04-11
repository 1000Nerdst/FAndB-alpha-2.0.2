<template>
  <v-container>
    <v-row>
      <v-col>
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left">Macronutrient</th>
                <th class="text-left">Maintainace Target</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in targets" :key="index">
                <td>{{ item.name }}</td>
                <td>{{ item.maintainace }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col>
        <v-date-picker
          v-model="date2"
          :events="functionEvents"
          :event-color="(date) => (date[9] % 2 ? 'red' : 'yellow')"
        ></v-date-picker>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-sheet class="mx-auto text-center" color="grey" :max-width="600">
          <v-card-text>
            <v-sheet color="grey lighter-2"></v-sheet>
          </v-card-text>
          <v-card-text>
            <div>User Progress Coming Soon</div>
          </v-card-text>
          <v-card-actions>
            <v-btn block text>See All Data</v-btn>
          </v-card-actions>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  data() {
    var proteinGrams = parseFloat(localStorage.getItem("protienGrams")).toFixed(2);
    var carbsGrams = parseFloat(localStorage.getItem("carbsGrams")).toFixed(2);
    var fatGrams = parseFloat(localStorage.getItem("fatGrams")).toFixed(2);


    return {
      date2: null,
      targets: [
        { name: "Protein", maintainace: proteinGrams },
        { name: "Carbs", maintainace: carbsGrams },
        { name: "Fat", maintainace: fatGrams },
      ],
      functionEvents: [],
    };
  },
};
</script>
