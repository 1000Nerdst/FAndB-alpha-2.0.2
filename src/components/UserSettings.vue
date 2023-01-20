<template>
    <v-container>
        <!-- make three rows -->
        <!-- this row will be show the users tragets -->
         <NavBarAndHeader/>
        <v-row>
             <v-col style="display: flex; justify-content:space-between;">
                 <v-card
            max-height="64" style="flex: 1;">
                <v-card-text >Energy Target &emsp;{{ targetCalories }}</v-card-text>
            </v-card>
             <v-card
            max-height="64" style="flex: 1;">
                <v-card-text>Maintenance Target &emsp;{{ maintenceCalories }}</v-card-text>
            </v-card>
             </v-col>

             
           
        </v-row>
        <!-- this row will be inputs for the user -->
        <v-row >
            <!-- make two columbs -->
            <!-- this col is made so the user can input their stats -->
            <v-col >
                <v-card >
                    <v-list>
                        <v-list-item
                        v-for="(option,i) in inputOptions"
                        :key="i"
                        >
                            <div v-if="option.formType === 'text'" style="width: 100%;">
                                <v-text-field v-if="option.text === 'Current Weight'"
                                label= "Current Weight"
                                v-model = currentWeight
                                outlined
                                ></v-text-field>
                                <v-text-field v-if="option.text === 'Height'"
                                label="Height"
                                v-model = currentHeight
                                outlined
                                ></v-text-field>
                                <v-text-field v-if="option.text === 'Age'"
                                label="Age"
                                v-model = currentAge
                                outlined
                                ></v-text-field>
                            </div>
                            <div v-if="option.formType === 'selects' && option.text === 'Active Days Per Week'" style="width: 100%;">
                                <v-select
                                v-model="selectActiveDays"
                                :items="activeDays"
                                menu-prop="auto"
                                label="Select"
                                hide-details
                                dense
                                outlined
                                single-line
                                ></v-select>
                            </div>
                            <div v-if="option.formType === 'selects' && option.text === 'Gender'" style="width: 100%;">
                                <v-select
                                v-model="selectGender"
                                :items="genders"
                                menu-prop="auto"
                                label="Select"
                                hide-details
                                dense
                                outlined
                                single-line
                                ></v-select>
                            </div>
                            <div v-if="option.formType === 'selects' && option.text === 'Goal'" style="width: 100%;">
                                <v-select
                                v-model="selectGoal"
                                :items="goals"
                                menu-prop="auto"
                                label="Select"
                                hide-details
                                dense
                                outlined
                                single-line
                                ></v-select>
                            </div>
                            <div v-if="option.formType === 'button' && option.text === 'Update Settings'" style="margin: 20px auto; ">
                                <v-btn @click="updateSettings" >Update Settings</v-btn>
                            </div>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
            <v-col>
                <v-card>
                    <template>
                        <v-row class="fill-height">
                            <v-col>
                                <!-- Set up the actual calendar, so start with a sheet -->
                                <v-sheet style="padding: 10px 20px ;">
                                    <!-- Get a menu when ever you click on an even -->
                                    <template>
                                        <v-row>
                                            <v-col
                                            cols="12"
                                            sm="7"
                                            >
                                                <v-row>
                                                    <!-- I took out the dates and made it and currentDate 
                                                    also took out range-->
                                                    <v-date-picker
                                                        v-model="dates"
                                                        multiple
                                                        style="margin: 0px auto;"
                                                        :color="dates.at(1) ? 'green':'yellow'"
                                                        header-color="primary"
                                                        :allowed-dates="allowedDates"
                                                    ></v-date-picker>
                                                </v-row>
                                                <v-row style="justify-content:center;">
                                                    <v-btn @click="createPlan">Create Plan</v-btn>
                                                </v-row>
                                            </v-col>
                                            <v-col
                                            cols="12"
                                            sm="5"
                                            >
                                                <v-row
                                                v-model="selectionOption">{{ currentSelect }}</v-row>
                                                <v-row>grocery day: {{ dates.at(0) }}</v-row>
                                                <v-row>meal prep start day: {{ dates.at(1) }}</v-row>
                                                <v-row>meal prep end day: {{ dates.at(2) }}</v-row>
                                            </v-col>
                                        </v-row>
                                    </template>
                                </v-sheet>
                            </v-col>
                        </v-row>
                    </template>
                </v-card>
            </v-col>
        </v-row>
        <!-- this row will contain the advanced settings -->
        <v-row style="padding: 12px; margin-top:50px;">
            <template>
                <div>
                    <div class="text-center d-flex pb-4">
                    <v-btn @click="openAll">
                        Advanced Settings
                    </v-btn>
                    </div>

                    <v-expansion-panels
                    v-model="panel"
                    multiple
                    >
                        <v-expansion-panel
                            v-for="(item,i) in items"
                            :key="i"
                        >
                            <v-expansion-panel-header>Coming Soon</v-expansion-panel-header>
                            <v-expansion-panel-content>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </div>  
            </template>
        </v-row>
    </v-container>
</template>

<script>
import { doc, updateDoc } from "firebase/firestore";
import { db as fsdb } from '../fb';
import calculateCalories from '../computations/userCalculations';
import calculateTargetCalories from '../computations/userTargetCal';
import { dateDiffInDays } from '../store/plansCRUD'
import { startGeneration } from '../computations/generateNewPlan'
// import NavBarAndHeader from "./NavBarAndHeader.vue";


var age = sessionStorage.getItem('age');
var weight = sessionStorage.getItem('weightLb');
var height = sessionStorage.getItem('heightF');
var activeDays = sessionStorage.getItem('activeDaysPerWeek');
var sex = sessionStorage.getItem('sex');
var goal = sessionStorage.getItem('goal');
var target = sessionStorage.getItem('calorieTarget');
var maintence = sessionStorage.getItem('maintenceTarget');

// var today = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000).toISOString().substr(0, 10);
console.log('this is when this is printed');

export default {
    data: () => ({
        inputOptions: [
            { formType:'text', text: 'Current Weight', inputName: '', value: sessionStorage.getItem('weightLb')},
            { formType:'text', text: 'Height', inputName: '', value: sessionStorage.getItem('heightF')},
            { formType:'text', text: 'Age', inputName: '', value: sessionStorage.getItem('age')},
            { formType:'selects', text: 'Active Days Per Week', inputName: '', value: sessionStorage.getItem('activeDaysPerWeek')},
            { formType:'selects', text: 'Gender', inputName: '', value: sessionStorage.getItem('sex')},
            { formType:'selects', text: 'Goal', inputName: '', value: sessionStorage.getItem('goal')},
            { formType:'button', text: 'Update Settings', inputName: ''},
        ],
        panel: [],
        items: 5,
        focus:'',
        type: 'month',
        typeToLable:{
            month: 'Month',
            week: 'Week',
            day: 'Day',
            '4day': '4 Days',
        },
        selectedEvent: {},
        selectedElement: null,
        selectedOpen: false,
        events: [],
        colors: ['yellow', 'green'],
        names: ['grocery day', 'planned meals'],
        weights: [152,153,150,152,154,154,155],
        dayCarousel:[
            {slideHeading:"Breakfast", color:"grey"},
            {slideHeading:"Lunch", color:"white"},
            {slideHeading:"Dinner", color:"grey"},
            {slideHeading:"Snacks", color:"white"},
        ],
        currentSelect: null,
        currentDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        // dates: ['2022-09-10', '2022-09-20'],
        dates: [],
        currentAge: age,
        currentWeight: weight,
        currentHeight: height,
        selectActiveDays: activeDays,
        activeDays: ['0','1','2','3','4','5','6','7',],
        selectGender: sex,
        genders: ['Male', 'Female', 'Other'],
        selectGoal: goal,
        goals: ['Gain 1 lb Per Week', 'Gain 1/2 lb Per Week', 'Maintence', 'Lose 1/2 lb Per Week', 'Lose 1 lb Per Week',],
        targetCalories: target,
        maintenceCalories: maintence,
        lastChange: null,
        timer: null,
        lockMealPlanDate: 'none',
        minDate: new Date(),
        maxDate: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)
    }),
    computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },
    created(){
        console.log('userSettings created');
        this.currentAge = sessionStorage.getItem('age');
        this.currentWeight = sessionStorage.getItem('weightLb');
        this.currentHeight = sessionStorage.getItem('heightF');
        this.selectActiveDays = sessionStorage.getItem('activeDaysPerWeek');
        this.selectGender = sessionStorage.getItem('sex');
        this.selectGoal = sessionStorage.getItem('goal');
        this.targetCalories = sessionStorage.getItem('calorieTarget');
        this.maintenceCalories = sessionStorage.getItem('maintenceTarget');

        //constantly reload
        let curAge = sessionStorage.getItem('age');
        let curWeight = sessionStorage.getItem('weightLb');
        let curHeight = sessionStorage.getItem('heightF');
        let curActiveDay = sessionStorage.getItem('activeDaysPerWeek');
        let curGender = sessionStorage.getItem('sex');
        let curGoal = sessionStorage.getItem('goal');
        let curTarget = sessionStorage.getItem('calorieTarget');
        let curMaintence = sessionStorage.getItem('maintenceTarget');

        this.lastChange = new Date();
        var startTime = new Date().getTime()

        //set the dates of the calendar
        // this.currentDate = new Date();

        //constanly check for changes
        this.timer = setInterval(() => {
            // console.log('checking for changes');
            // console.log(this.dates.at(0));
            // console.log(this.dates.at(1));
            // console.log(this.dates.at(2));
            const newAge = sessionStorage.getItem('age');
            const newWeight = sessionStorage.getItem('weightLb');
            const newHeight = sessionStorage.getItem('heightF');
            const newActiveDay = sessionStorage.getItem('activeDaysPerWeek');
            const newGender = sessionStorage.getItem('sex');
            const newGoal = sessionStorage.getItem('goal');
            const newTarget = sessionStorage.getItem('calorieTarget');
            const newMaintence = sessionStorage.getItem('maintenceTarget');

            if (new Date().getTime() - startTime > 600000){
                clearInterval(this.timer)
                return
            }
            
            //check for change in age 
            if (newAge !== curAge){
                curAge = newAge;
                sessionStorage.setItem('age', curAge);
                this.currentAge = sessionStorage.getItem('age');
                this.lastChange = new Date();
            }
            //check for change in weight
            if (newWeight !== curWeight){
                curWeight = newWeight;
                sessionStorage.setItem('weightLb', curWeight);
                this.currentWeight = sessionStorage.getItem('weightLb');
                this.lastChange = new Date();
            }
            //check for change in height
            if (newHeight !== curHeight){
                curHeight = newHeight;
                sessionStorage.setItem('heightF', curHeight);
                this.currentHeight = sessionStorage.getItem('heightF');
                this.lastChange = new Date();
            }
            //check for change in active days
            if (newActiveDay !== curActiveDay){
                curActiveDay = newActiveDay;
                sessionStorage.setItem('activeDaysPerWeek', curActiveDay);
                this.selectActiveDays = sessionStorage.getItem('activeDaysPerWeek');
                this.lastChange = new Date();
            }
            //check for change in gender
            if (newGender !== curGender){
                curGender = newGender;
                sessionStorage.setItem('sex', curGender);
                this.selectGender = sessionStorage.getItem('sex');
                this.lastChange = new Date();
            }
            //check for change in goal
            if (newGoal !== curGoal){
                curGoal = newGoal;
                sessionStorage.setItem('goal', curGoal);
                this.selectGoal = sessionStorage.getItem('goal');
                this.lastChange = new Date();
            }
            //check for change in target
            if (newTarget !== curTarget){
                curTarget = newTarget;
                sessionStorage.setItem('calorieTarget', curTarget);
                this.targetCalories = sessionStorage.getItem('calorieTarget');
                this.lastChange = new Date();
            }
            //check for change in maintence
            if (newMaintence !== curMaintence){
                curMaintence = newMaintence;
                sessionStorage.setItem('maintenceTarget', curMaintence);
                this.maintenceCalories = sessionStorage.getItem('maintenceTarget');
                this.lastChange = new Date();
            }


            //isAdmin is never used see what this does
            //const isAdmin = sessionStorage.getItem('isAdmin');
            //console.log(isAdmin);
            //console.log('test');
            //console.log('selectionOption statment')
            selectO: if (this.dates.at(0) === undefined) {
                this.currentSelect = 'Select your grocery store date';
                this.lockMealPlanDate = 'none';
                break selectO;
            }else if(this.dates.at(1) === undefined){
                this.currentSelect = 'Select your plan start date';
                this.lockMealPlanDate = 'startDate';
                break selectO;
            }else if(this.dates.at(2) === undefined){
                this.currentSelect = 'Select your plan end date';
                this.lockMealPlanDate = 'endDate';
                break selectO;
            }else{
                this.currentSelect = 'Select your prep dates';
                this.lockMealPlanDate = 'planDates';
                break selectO;
            }
        }, 500)
    },
    mounted(){
        //this.$refs.calendar.checkChange()
        window.addEventListener('storage', this.storageListener);
        document.addEventListener('storge', this.storageListener);
    },
    beforeDestroy(){
        window.removeEventListener('storage', this.storageListener);
        document.removeEventListener('storge', this.storageListener);
        clearInterval(this.timer);
    },
    methods:{
        viewDay ({ date }){
            this.focus = date
            this.type = 'day'
        },
        getEventColor (event){
            return event.color
        },
        setToday(){
            this.focus = ''
        },
        prev (){
            this.$refs.calendar.prev()
        },
        next (){
            this.$refs.calendar.next()
        },
        showEvent({ nativeEvent, event}){
            const open = () =>{
                this.selectedEvent = event
                this.selectedElement = nativeEvent.target
                requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
            }

            if (this.selectedOpen){
                this.selectedOpen = false
                requestAnimationFrame(() => requestAnimationFrame(() => open()))
            }else{
                open()
            }

            nativeEvent.stopPropagation()
        },
        allowedDates (val){
            var today = new Date(this.currentDate);
            var startDate = new Date(this.currentDate);
            var checkDate = new Date(val);
            var groceryDate = new Date(this.dates.at(0));
            var planStart = new Date(this.dates.at(1));
            var planEnd = new Date(this.dates.at(2));
            var endDate= new Date(this.currentDate);
            var allow = false;
            var lockVersion = this.lockMealPlanDate;

            switch (lockVersion) {
                case 'startDate':
                startDate.setDate(groceryDate.getDate());
                endDate.setDate(groceryDate.getDate() + 14);
                break;
                case 'endDate':
                startDate.setDate(planStart.getDate());
                endDate.setDate(planStart.getDate() + 14);
                break;
                case 'planDates':
                if (checkDate >= planStart && checkDate <= planEnd) {
                    // Allow dates between planStart and planEnd
                    allow = true;
                } else {
                    // Lock all other dates
                    allow = false;
                }
                break;
                case 'none':
                startDate.setDate(today.getDate());
                endDate.setDate(today.getDate() + 14);
                break;
                default:
                startDate.setDate(today.getDate());
                endDate.setDate(today.getDate() + 14);
                break;
            }

            console.log('Start Date: ', startDate);
            console.log('Check Date: ', checkDate);
            console.log('End Date: ', endDate);

            if (checkDate >= startDate && checkDate <= endDate){
                allow = true;
            }

            console.log('Allow: ', allow);
            return allow;
        },
        rnd (a, b){
            return Math.floor((b -a + 1) * Math.random()) + a
        },
        openAll () {
            this.panel = [...Array(this.items).keys()].map((k, i) => i)
        },
        // Reset the panel
        none () {
            this.panel = []
        },
        async updateSettings (){
            sessionStorage.setItem('weightLb', this.currentWeight);
            sessionStorage.setItem('heightF', this.currentHeight);
            sessionStorage.setItem('age', this.currentAge);
            sessionStorage.setItem('activeDaysPerWeek', this.selectActiveDays);
            sessionStorage.setItem('sex', this.selectGender);
            sessionStorage.setItem('goal', this.selectGoal);

            //calcuate calorie values
            calculateCalories();
            calculateTargetCalories();

            this.maintenceCalories = sessionStorage.getItem('maintenceTarget');
            this.targetCalories = sessionStorage.getItem('calorieTarget');

            //save the information to the firestore
            const updatedUserData = {
                activeDaysPerWeek: parseInt(this.selectActiveDays),
                goal: this.selectGoal,
                heightF: parseFloat(this.currentHeight),
                sex: this.selectGender,
                weightLb: parseFloat(this.currentWeight),
                maintenceTarget: sessionStorage.getItem('maintenceTarget'),
                calorieTarget: sessionStorage.getItem('calorieTarget'),
                carbsGrams: sessionStorage.getItem('carbsGrams'),
                fatGrams: sessionStorage.getItem('fatGrams'),
                protienGrams: sessionStorage.getItem('protienGrams'),
            }

            const uid = sessionStorage.getItem('userID');
            console.log(uid);
            console.log(updatedUserData);
            await updateDoc(doc(fsdb, 'userData', uid), updatedUserData);
        },
        async createPlan(){
            var length = this.dates.length
            console.log('length: ',length)

            var plansToMake = 1
            if(length > 3){
                console.log('start plan generation')
                for(var i = 3; i < length; i++){
                    console.log('loop')
                    plansToMake++
                }
            }
            console.log('plans to make:', plansToMake)

            //set starting dates and lengths
            var startingDate = this.dates[1]
            var endingDate = this.dates[2]
            var planLength = dateDiffInDays(startingDate, endingDate)
            var startingDates = []
            var planLengths = []

            var cur
            var temp
            // var startVar = startingDate
            // var endVar = 2

            //make the final Grocery list array
            let breakfastList = [[],[],[]];
            let lunchList = [[],[],[]];
            let dinnerList = [[],[],[]];
            let snackList = [[],[],[]];

            let finalGroceryList = [breakfastList, lunchList, dinnerList, snackList ]

            for(var j=0; j<plansToMake; j++){
                cur = j + 2
                temp = j + 3
                if(plansToMake == 1){
                    console.log('starting date:', startingDate)
                    console.log('days:',planLength)
                    startingDates.push(startingDate)
                    planLengths.push(planLength)
                }else if(j == 0 && plansToMake != 1){
                    console.log('this is the first loop')
                    console.log('starting date:', startingDate)
                    console.log('ending date: ', this.dates[cur])
                    planLength = dateDiffInDays(startingDate, this.dates[temp])
                    startingDates.push(startingDate)
                    planLengths.push(planLength)
                }else if(j == (plansToMake - 1) && plansToMake != 1){
                    console.log('this is final loop')
                    console.log('starting date:', this.dates[cur])
                    console.log('ending date: ', endingDate)
                    planLength = dateDiffInDays(this.dates[cur], endingDate)
                    startingDates.push(this.dates[cur])
                    planLengths.push(planLength)
                }else{
                    console.log('working out the logic')
                    console.log('starting date:', this.dates[cur])
                    console.log('ending date: ', this.dates[temp])
                    planLength = dateDiffInDays(this.dates[cur], this.dates[temp])
                    startingDates.push(this.dates[cur])
                    planLengths.push(planLength)
                }
            }

            sessionStorage.setItem('groceryDate', JSON.stringify(this.dates[0]))

            //clear out the previous grocery list
            // sessionStorage.setItem('breakfastGroceryList', JSON.stringify([]))
            // sessionStorage.setItem('lunchGroceryList', JSON.stringify([]))
            // sessionStorage.setItem('dinnerGroceryList', JSON.stringify([]))
            // sessionStorage.setItem('snackGroceryList', JSON.stringify([]))

            console.log('starting dates:', startingDates)
            console.log('length:', planLengths)

            startGeneration(await startingDates, await planLengths, finalGroceryList)

            // for(var k = 0; k < plansToMake; k++){
            //     console.log('making plan')
            // }

            //here what I'm going to do because it all so messy and all of this needs to be commented
            //I'm going to make two new functions in the storeUsersInfo that will store the make the ingredient list and the other will make a array of dates and add any connections listed to it

        },
        reloadUserData(){

        },
        storageListener(){
            console.log('something in storage changed')
        },
        selectionOption () {
            //console.log('test');
            console.log('selectionOption statment')
            selectO: if (this.dates.at(0) === undefined) {
                this.currentSelect = 'Select your grocery store date';
                break selectO;
            }else if(this.dates.at(1) === undefined){
                this.currentSelect = 'Select your plan start date';
                break selectO;
            }else if(this.dates.at(2) === undefined){
                this.currentSelect = 'Select your plan end date';
                break selectO;
            }else{
                this.currentSelect = '';
                break selectO;
            }
      },
    },
}
</script>

<style>

</style>