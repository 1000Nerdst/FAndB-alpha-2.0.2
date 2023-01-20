<template>
  <!-- divide the screen into three section -->
  <!-- recipe info section section for the user to put key information-->
  <v-container>
    <v-row>
        <v-sheet
        width="auto">
            <v-row>
                <v-col>
                    <!-- input the recipe name -->
                    <v-text-field
                    label="Recipe Name"
                    v-model="recipeName"
                    outlined>
                    </v-text-field>
                </v-col>
                <v-col>
                    <!-- input the authors name -->
                    <v-text-field
                    label="Recipe Author"
                    v-model="recipeAuthor"
                    outlined>
                    </v-text-field>
                </v-col>
                <v-col>
                    <!-- input the authors name -->
                    <v-text-field
                    label="Servings"
                    v-model="servingsField"
                    outlined>
                    </v-text-field>
                </v-col>
            </v-row>
            <!-- meal type checkbox -->
            <v-row>
                <v-col>
                    <v-checkbox
                    label="Main Course"
                    value="Main Course"
                    v-model="mainCourseCheck"
                    ></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox
                    label="Side"
                    value="Side"
                    v-model="sideCheck"
                    ></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox
                    label="Meal Prep"
                    value="Meal Prep"
                    v-model="mealPrepCheck"
                    ></v-checkbox>
                </v-col>
            </v-row>
            <!-- meal timing checkbox -->
            <v-row>
                <v-col>
                    <v-checkbox
                    label="Breakfast"
                    value="Breakfast"
                    v-model="breakfastCheck"
                    ></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox
                    label="Lunch"
                    value="Lunch"
                    v-model="lunchCheck"
                    ></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox
                    label="Dinner"
                    value="Dinner"
                    v-model="dinnerCheck"
                    ></v-checkbox>
                </v-col>
                <v-col>
                    <v-checkbox
                    label="Snack"
                    value="Snack"
                    v-model="snackCheck"
                    ></v-checkbox>
                </v-col>
            </v-row>
            <!-- text area for decription size of 3 rows-->
            <v-row>
                <v-textarea
                label="Description"
                outlined
                rows="3"
                v-model="descriptionArea">
                </v-textarea>
            </v-row>
            <v-row>
                <v-textarea
                label="Instructions"
                outlined
                rows="3"
                v-model="instructionArea">
                </v-textarea>
            </v-row>
        </v-sheet>
    </v-row>
    <!-- next there will be a row for adding serving size, ingredient with an auto complete, and an add button -->
    <!-- have the final view and save section, this will have a datatable that would be updated on add button click, will allow for deleting of items and then an add button -->
    <v-row>
        <template>
            <v-data-table
            :headers="ingredentsHeaders"
            :items = ingredents
            class="elevation-1">
                <template v-slot:top>
                    <v-dialog
                    v-model="dialog">
                        <template v-slot:activator="{ on, attrs }">
                            <v-spacer></v-spacer>
                            <v-btn
                            v-bind="attrs"
                            v-on="on">
                                Add
                            </v-btn>   
                        </template>
                        <!-- display a text card that will show up when a new ingredient is being added -->
                        <v-card>
                            <v-card-title>
                                <span> text goes here </span>
                            </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-col>
                                        <v-text-field
                                        v-model="editedItem.ingredent"
                                        label="Ingredent"
                                        outlined></v-text-field>
                                        <!-- this is where the incomplete autocomplete was started -->
                                        <!-- <v-autocomplete
                                        v-model="editedItem.ingredent"
                                        :items="items"
                                        :loading="isLoading"
                                        hide-no-data
                                        hide-selected
                                        item-text="Description"
                                        item-value="ingredent"
                                        label="Ingredent"
                                        return-object
                                        outlined></v-autocomplete> -->
                                    </v-col>
                                    <v-col>
                                        <v-text-field
                                        v-model="editedItem.servingSize"
                                        label="Serving Size"
                                        outlined></v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field
                                        v-model="editedItem.servingMesure"
                                        label="Measure"
                                        outlined></v-text-field>
                                    </v-col>
                                </v-row>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                text
                                @click="close">
                                    Cancel
                                </v-btn>
                                <v-btn
                                text
                                @click="save">
                                    Save
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogDelete">
                        <v-card>
                            <v-card-title>Are you sure you want to delete this item?</v-card-title>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn 
                                text
                                @click="closeDelete">Cancel</v-btn>
                                <v-btn 
                                text
                                @click="deleteItemConfirm">OK</v-btn>
                                <v-spacer></v-spacer>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)">
                        mdi-pencil
                    </v-icon>
                    <v-icon
                    small
                    @click="deleteItem(item)">
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>
        </template>
    </v-row>
    <v-row>
        <v-btn @click="saveRecipe">Sumbit</v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { verifyIngredients, getIId, uploadToDB } from "../store/recipeCRUD"
import { nlpApiPost } from "../apis/nutritionixApi"

export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        ingredentsHeaders: [
            {text: 'Ingredient', value: 'ingredent'},
            {text: 'Serving Size', value: 'servingSize'},
            {text: 'Measure', value: 'servingMesure'},
            {text: 'Actions', value: 'actions', sortable: false },
        ],
        ingredents: [],
        editedItem: { ingredent: '', servingSize: 0.0, servingMesure: '' },
        defaultItem: { ingredent: '', servingSize: 0.0, servingMesure: '' },
        editedIndex: -1,
        saveIndex: 0,
        recipeName: null,
        recipeAuthor: null,
        servingsField: null,
        descriptionArea: null,
        instructionArea: null,
        mainCourseCheck: false,
        sideCheck: false,
        mealPrepCheck: false,
        breakfastCheck: false,
        lunchCheck: false,
        dinnerCheck: false,
        snackCheck: false,
        search: null,
        entries: [],
        isLoading: false,
    }),

    created () {
        this.initialize()
    },

    methods: {
        initialize () {
            // this.ingredents = [ {ingredent: 'test', servingSize: 5.2 }]  
        },

        close() {
            this.dialog = false
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        save() {
            if (this.editedIndex > -1){
                Object.assign(this.ingredents[this.editedIndex], this.editedItem)
            }else{
                this.ingredents.push(this.editedItem)
            }
            this.close()
        },
        closeDelete(){
            this.dialogDelete = false
            this.$nextTick(() =>{
                this.editedItem = Object.assign({}, this.defaultItem)
                this.editedIndex = -1
            })
        },
        deleteItemConfirm(){
            this.ingredents.splice(this.editedIndex, 1)
            this.closeDelete()
        },
        editItem (item){
            this.editedIndex = this.ingredents.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem (item){
            this.editedIndex = this.ingredents.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialogDelete = true
        },
        async saveRecipe(){
            console.log('Saving Recipe to DB')

            var recipeInfo = []
            recipeInfo.push(this.recipeName)
            recipeInfo.push(this.recipeAuthor)
            recipeInfo.push(this.descriptionArea)
            recipeInfo.push(this.instructionArea)
            recipeInfo.push(this.servingsField)

            var checkValuesArray = []
            checkValuesArray.push(this.mainCourseCheck)
            checkValuesArray.push(this.sideCheck)
            checkValuesArray.push(this.mealPrepCheck)
            checkValuesArray.push(this.breakfastCheck)
            checkValuesArray.push(this.lunchCheck)
            checkValuesArray.push(this.dinnerCheck)
            checkValuesArray.push(this.snackCheck)

            console.log('check value array:', checkValuesArray)

            const arrayCopy = JSON.parse(JSON.stringify(this.ingredents))
            var len = arrayCopy.length
            console.log('copied:', arrayCopy)
            console.log('length:', len)

            var ingredentIDArray = []
            var ingredentNameArray = []
            var ingredentServingArray = []
            var ingredentMeasureArray = []

            verifyIngredients(arrayCopy)
            for(var i = 0; i < len; i++){
                console.log('saving ingredent:', arrayCopy[i].ingredent)
                console.log('ingredent id:', await getIId(arrayCopy, i))
                ingredentIDArray.push(await getIId(arrayCopy, i))
                ingredentNameArray.push(arrayCopy[i].ingredent)
                ingredentServingArray.push(arrayCopy[i].servingSize)
                ingredentMeasureArray.push(arrayCopy[i].servingMesure)

                console.log(ingredentIDArray)
            }
            
            console.log(ingredentIDArray)
            console.log(ingredentNameArray)
            console.log(ingredentServingArray)
            console.log(ingredentMeasureArray)

            var nlpString = new String("")

            for (i = 0; i < len; i++){
                nlpString = nlpString + arrayCopy[i].servingSize + " " + arrayCopy[i].servingMesure + " " + arrayCopy[i].ingredent + ", "
            }
            console.log(nlpString)

            const jsonFoods = nlpApiPost(nlpString)
            const obj = JSON.parse(JSON.stringify(await jsonFoods))
            console.log('jsonFoods: ', await jsonFoods)
            
            console.log('jsonFoods: ', obj.foods[0].nf_calories)

            await uploadToDB(len, recipeInfo, checkValuesArray, ingredentIDArray, ingredentNameArray, ingredentServingArray, ingredentMeasureArray, await jsonFoods)

            this.recipeName = null
            this.recipeAuthor = null
            this.descriptionArea = null
            this.instructionArea = null
            this.servingsField = null

            this.mainCourseCheck = false
            this.sideCheck = false
            this.mealPrepCheck = false
            this.breakfastCheck = false
            this.lunchCheck = false
            this.dinnerCheck = false
            this.snackCheck = false

            this.entries = []
        },
    },
    computed: {
        items () {
            return this.entries.map(entry => {
                const Description = entry.Description.length > 100
                ? entry.Description.slice(0, 100) + '...'
                : entry.Description

                return Object.assign({}, entry, { Description })
            })
        }
    },
    watch: {
        dialog (val) {
            val || this.close()
        },
        dialogDelete (val) {
            val || this.closeDelete()
        },
        search (val){
            //items are already loaded
            if (this.items.length > 0) return

            //items have been requested
            if (this.isLoading) return      
            
            console.log(val)
        }
    },
}
</script>

<style>

</style>