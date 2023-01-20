//import { collection, getDocs, query, where, addDoc, doc, setDoc } from "firebase/firestore"
import { collection, getDoc, getDocs, query, where, doc, setDoc } from "firebase/firestore"
import { db as fsdb } from '../fb';
import { sendEmail } from '../computations/sendEmail'

export default async function generateNewPlan(){

    // console.log('Start Generation')

}

export async function startGeneration(startingDates, planLengths){

    console.log('Start Generation')
    const baseNumberStored = await getDataBaseNumber()

    //console.log('storage complete', baseNumberStored)
    //put up there an empty array of arrays
    var finalGroceryList = [[[],[],[]],[[],[],[]],[[],[],[]],[[],[],[]]]

    if (await baseNumberStored == true){
        var saveDay = false
        // var breakfastData = sessionStorage.getItem('breakfastArray')
        // console.log('stored breakfast data', breakfastData)

        for(var i = 0; i < startingDates.length; i++){
            while (saveDay != true) {
            
                saveDay = await generateDay()
            }

            if(saveDay == true){

                const uid = sessionStorage.getItem('userID');

                const planData = {
                    uid: uid,
                    startingDate: startingDates[i],
                    planLength: planLengths[i],
                    breakfast: JSON.parse(sessionStorage.getItem('breakfastItem')),
                    breakfastServingSize: JSON.parse(sessionStorage.getItem('breakfastServingSize')),
                    lunch: JSON.parse(sessionStorage.getItem('lunchItem')),
                    lunchServingSize: JSON.parse(sessionStorage.getItem('lunchServingSize')),
                    dinner: JSON.parse(sessionStorage.getItem('dinnerItem')),
                    dinnerServingSize: JSON.parse(sessionStorage.getItem('dinnerServingSize')),
                    snack: JSON.parse(sessionStorage.getItem('snackItem')),
                    snackServingSize: JSON.parse(sessionStorage.getItem('snackServingSize')),
                    groceryDate: JSON.parse(sessionStorage.getItem('groceryDate')),
                }
                
                var startingDate = await startingDates[i]

                console.log("var able type for meals")
                console.log(typeof startingDate)

                // const recipeRef = collection(fsdb, "recipeInfo");
                await setDoc(doc(fsdb, 'mealPlans', uid),{
                    uid: uid
                }).then(()=>{
                    setDoc(doc(fsdb, 'mealPlans', uid, 'userMealPlan', startingDate), planData)
                })
                //await addDoc(doc(fsdb, 'mealPlans', uid, 'userMealPlan'), planData);
                // const newDoc = await addDoc(docRef, docData)

            }else{
                console.log('error')
            }
            
            //make the grocey list
            finalGroceryList = await generationGroceryList(startingDate, planLengths[i], finalGroceryList);

            console.log('while loop broken')
        }
    }

    //take the generated Grocery list, finaize it and save it
    saveAndStoreGroceryList(finalGroceryList);

    //send an email to the customer with their meal plan, grocery list, and recipies
    sendEmail();

    console.log('outside of if statement')
    //make the length of the arrays
    //make a serving size random number
    //make a random number between 

}

export async function getDataBaseNumber(){
    const recipeRef = collection(fsdb, "recipeInfo");
    
    var breakfastData
    var lunchData
    var dinnerData
    var snackData

    for(var i = 0; i < 4; i++){
        switch (i) {
            case 0:{
                
                const breafastQ = query(recipeRef, where("isBreakfast", "==", "Breakfast"))

                // console.log(await breafastQ)
                
                const { docs } = await getDocs(breafastQ)

                breakfastData = docs.map((doc) =>({
                    id: doc.id,
                    ...doc.data(),
                }))

                
                
                break;}
            case 1:{
            
                const lunchQ = query(recipeRef, where("isLunch", "==", "Lunch"))

                // console.log(await lunchQ)
                
                const { docs } = await getDocs(lunchQ)

                lunchData = docs.map((doc) =>({
                    id: doc.id,
                    ...doc.data(),
                }))

                
                
                break;}
            case 2:{
        
                const dinnerQ = query(recipeRef, where("isDinner", "==", "Dinner"))

                // console.log(await dinnerQ)
                
                const { docs } = await getDocs(dinnerQ)

                dinnerData = docs.map((doc) =>({
                    id: doc.id,
                    ...doc.data(),
                }))
                
                break;}
            case 3:{
    
                const snackQ = query(recipeRef, where("isSnack", "==", "Snack"))

                // console.log(await snackQ)
                
                const { docs } = await getDocs(snackQ)

                snackData = docs.map((doc) =>({
                    id: doc.id,
                    ...doc.data(),
                }))

                
                
                break;}
            default:{
                // console.log('other')
                break;}
        }
    }

    // console.log('breakfast data: ',await breakfastData)
    // console.log('lunch data: ',await lunchData)
    // console.log('dinner data: ',await dinnerData)
    // console.log('snack data: ',await snackData)
    
    //pass to local data 
    sessionStorage.setItem('breakfastArray', JSON.stringify(await breakfastData))
    sessionStorage.setItem('lunchArray', JSON.stringify(await lunchData))
    sessionStorage.setItem('dinnerArray', JSON.stringify(await dinnerData))
    sessionStorage.setItem('snackArray', JSON.stringify(await snackData))
    
    if ( await breakfastData != null && await lunchData != null && await dinnerData != null && await snackData != null){
        return true
    }else{
        return false
    }
}

async function generateDay(){
    var saveDay = false

    //get user nutritional values
    var userCal = parseFloat(sessionStorage.getItem('calorieTarget')) 
    var userProtein = parseFloat(sessionStorage.getItem('protienGrams'))
    var userFats = parseFloat(sessionStorage.getItem('fatGrams'))
    //var userCarbs = sessionStorage.getItem('carbsGrams')

    //make and upper and lower varience
    var limitCal = (userCal * 0.025)
    var userCalUpper = userCal + limitCal
    var userCalLower = userCal - 100

    //set the current meal plan values to 0
    var planCal = 0
    var planProtein = 0
    var planFats = 0
    // var planCarbs = 0

    //get all the meal type arrays
    var breakfastArray = JSON.parse(sessionStorage.getItem('breakfastArray'))
    var lunchArray = JSON.parse(sessionStorage.getItem('lunchArray'))
    var dinnerArray = JSON.parse(sessionStorage.getItem('dinnerArray'))
    var snackArray = JSON.parse(sessionStorage.getItem('snackArray'))

    //find the length of each array
    var breakfastLength = breakfastArray.length
    var lunchLength = lunchArray.length
    var dinnerLength = dinnerArray.length
    var snackLength = snackArray.length

    //set checks states
    var meetsCal = false
    var meetsProtein = false
    var meetsFats = false
    //var meetsCarbs = false

    //get a random meal for each meal type
    var breakfastMeal = (getRandomIntInclusive(0, breakfastLength - 1))
    var lunchMeal = (getRandomIntInclusive(0, lunchLength - 1))
    var dinnerMeal = (getRandomIntInclusive(0, dinnerLength - 1))
    var snackMeal = (getRandomIntInclusive(0, snackLength - 1))

    //get a random serving size for each meal
    var breakfastServingSize = (getRandomIntInclusive(2, 6) * .25)
    var lunchServingSize = (getRandomIntInclusive(2, 6) * .25)
    var dinnerServingSize = (getRandomIntInclusive(2, 6) * .25)
    var snackServingSize = (getRandomIntInclusive(2, 8) * .25)

    //now read the random meal and it values
    var breakfastItem = breakfastArray[breakfastMeal]
    planCal = ( breakfastItem.totalCalories * breakfastServingSize ) + planCal
    planProtein = ( breakfastItem.protienTotal * breakfastServingSize ) + planProtein
    planFats = ( breakfastItem.fatsTotal * breakfastServingSize ) + planFats
    // planCarbs = ( breakfastItem.carbTotal * breakfastServingSize ) + planCarbs
    sessionStorage.setItem('breakfastItem', JSON.stringify(await breakfastItem))
    sessionStorage.setItem('breakfastServingSize', JSON.stringify(await breakfastServingSize))

    var lunchItem = lunchArray[lunchMeal]
    planCal = ( lunchItem.totalCalories * lunchServingSize ) + planCal
    planProtein = ( lunchItem.protienTotal * lunchServingSize ) + planProtein
    planFats = ( lunchItem.fatsTotal * lunchServingSize ) + planFats
    // planCarbs = ( lunchItem.carbTotal * lunchServingSize ) + planCarbs
    sessionStorage.setItem('lunchItem', JSON.stringify(await lunchItem))
    sessionStorage.setItem('lunchServingSize', JSON.stringify(await lunchServingSize))


    var dinnerItem = dinnerArray[dinnerMeal]
    planCal = ( dinnerItem.totalCalories * dinnerServingSize ) + planCal
    planProtein = ( dinnerItem.protienTotal * dinnerServingSize ) + planProtein
    planFats = ( dinnerItem.fatsTotal * dinnerServingSize ) + planFats
    // planCarbs = ( dinnerItem.carbTotal * dinnerServingSize ) + planCarbs
    sessionStorage.setItem('dinnerItem', JSON.stringify(await dinnerItem))
    sessionStorage.setItem('dinnerServingSize', JSON.stringify(await dinnerServingSize))


    var snackItem = snackArray[snackMeal]
    planCal = ( snackItem.totalCalories * snackServingSize ) + planCal
    planProtein = ( snackItem.protienTotal * snackServingSize ) + planProtein
    planFats = ( snackItem.fatsTotal * snackServingSize ) + planFats
    // planCarbs = ( snackItem.carbTotal * snackServingSize ) + planCarbs
    sessionStorage.setItem('snackItem', JSON.stringify(await snackItem))
    sessionStorage.setItem('snackServingSize', JSON.stringify(await snackServingSize))

    //print out the totals
    // console.log('total cal', planCal)
    // console.log('total protein', planProtein)
    // console.log('user protein', userProtein)
    // console.log('total fats', planFats)
    // console.log('total carbs', planCarbs)

    //run status checks
    if( userCalUpper > planCal  && planCal > userCalLower){
        // console.log('meets calorie targets')
        meetsCal = true
    }else{
        meetsCal = false
    }

    if( planProtein > userProtein ){
        // console.log('meets protein target')
        meetsProtein = true
    }else{
        meetsProtein = false
    }

    if( planFats > userFats ){
        // console.log('meets fats target')
        meetsFats = true
    }else{
        meetsFats = false
    }


    if ( meetsCal && meetsProtein && meetsFats){
        // console.log('requirements are meet')
        saveDay = true
    }else{
        saveDay = false
    }
    return saveDay
}

function getRandomIntInclusive(min, max){
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//this is the fuction that will come in an create the grocery list
export async function generationGroceryList(startingDate, planLength, finalGroceryList){

    //First the the imporant information such as uid and grocery store date
    const uid = sessionStorage.getItem('userID');

    //take out the breakfast, lunch, dinner and snack list out of final grocery list
    let breakfastList = finalGroceryList[0];
    let lunchList = finalGroceryList[1];
    let dinnerList = finalGroceryList[2];
    let snackList = finalGroceryList[3];

    //get the final breakfast verison of servings, name and measure
    let breakfastiServingList = breakfastList[0];
    let breakfastiNameList = breakfastList[1];
    let breakfastiMeasuresList = breakfastList[2];

    //repeat for lunch
    let lunchiServingList = lunchList[0];
    let lunchiNameList = lunchList[1];
    let lunchiMeasuresList = lunchList[2];

    //repeat for dinner
    let dinneriServingList = dinnerList[0];
    let dinneriNameList = dinnerList[1];
    let dinneriMeasuresList = dinnerList[2];

    //repeat for snack
    let snackiServingList = snackList[0];
    let snackiNameList = snackList[1];
    let snackiMeasuresList = snackList[2];

    //Get current Grocery list from session storage and break up based on its timing and name
    let breakfastGroceryList = [];
    let lunchGroceryList = [];
    let dinnerGroceryList = [];
    let snackGroceryList = [];

    //Navaigate to the document that has an ID that matches the starting Date
    //mealPlans->Current User Id->userMealPlan->startingDate
    const datesDoc = doc(fsdb, "mealPlans",uid,'userMealPlan',startingDate);

    //snap to the document
    const datesDocSnap = await getDoc(datesDoc);

    //set up the vars for breakfast, lunch, dinner and snack data and their sizes
    var breakfastServing, breakfastData, lunchServing, lunchData, dinnerServing, dinnerData, snackServing, snackData;

    //see if the document is there
    if(datesDocSnap.exists()){
        breakfastServing = datesDocSnap.data().breakfastServingSize;
        breakfastData = datesDocSnap.data().breakfast;
        lunchServing = datesDocSnap.data().lunchServingSize;
        lunchData = datesDocSnap.data().lunch;
        dinnerServing = datesDocSnap.data().dinnerServingSize;
        dinnerData = datesDocSnap.data().dinner;
        snackServing = datesDocSnap.data().snackServingSize;
        snackData = datesDocSnap.data().snack;
    } else {
        console.log("error")
    }

    //turn the iServings into float arrays
    var breakfastiServingArray = breakfastData.iServings.map(parseFloat);
    var lunchiServingArray = lunchData.iServings.map(parseFloat);
    var dinneriServingArray = dinnerData.iServings.map(parseFloat);
    var snackiServingArray = snackData.iServings.map(parseFloat);

    //get the ingredient names and measurements as well
    var breakfastiNamesArray = breakfastData.iNames;
    var lunchiNamesArray = lunchData.iNames;
    var dinneriNamesArray = dinnerData.iNames;
    var snackiNamesArray = snackData.iNames;
    var breakfastiMeasuresArray = breakfastData.iMeasures;
    var lunchiMeasuresArray = lunchData.iMeasures;
    var dinneriMeasuresArray = dinnerData.iMeasures;
    var snackiMeasuresArray = snackData.iMeasures;

    //breakfast
    //multiply the whole array by the number of days and the servings
    //define the multiper plan lenght times the serving size
    var multiplier = parseFloat(planLength) * parseFloat(breakfastServing);
    console.log(multiplier)
    for(let i=0; i<breakfastiServingArray.length; i++)
        breakfastiServingArray[i] *= multiplier;

    //lunch
    //multiply the whole array by the number of days and the servings
    //define the multiper plan lenght times the serving size
    multiplier = parseFloat(planLength) * parseFloat(lunchServing);
    for(let i=0; i<lunchiServingArray.length; i++)
        lunchiServingArray[i] *= multiplier;

    //dinner
    //multiply the whole array by the number of days and the servings
    //define the multiper plan lenght times the serving size
    multiplier = parseFloat(planLength) * parseFloat(dinnerServing);
    for(let i=0; i<dinneriServingArray.length; i++)
        dinneriServingArray[i] *= multiplier;

    //snack
    //multiply the whole array by the number of days and the servings
    //define the multiper plan lenght times the serving size
    multiplier = parseFloat(planLength) * parseFloat(snackServing);
    for(let i=0; i<snackiServingArray.length; i++)
        snackiServingArray[i] *= multiplier;

    //add the vaules from the breakfast array into the breakfast list
    breakfastiServingList = [...breakfastiServingList, ...breakfastiServingArray];
    breakfastiNameList = [...breakfastiNameList, ...breakfastiNamesArray];
    breakfastiMeasuresList = [...breakfastiMeasuresList, ...breakfastiMeasuresArray];
    breakfastGroceryList = [breakfastiServingList, breakfastiNameList, breakfastiMeasuresList];

    //repeat for lunch
    lunchiServingList = [...lunchiServingList, ...lunchiServingArray];
    lunchiNameList = [...lunchiNameList, ...lunchiNamesArray];
    lunchiMeasuresList = [...lunchiMeasuresList, ...lunchiMeasuresArray];
    lunchGroceryList = [lunchiServingList, lunchiNameList, lunchiMeasuresList];

    //repeat for dinner
    dinneriServingList = [...dinneriServingList, ...dinneriServingArray];
    dinneriNameList = [...dinneriNameList, ...dinneriNamesArray];
    dinneriMeasuresList = [...dinneriMeasuresList, ...dinneriMeasuresArray];
    dinnerGroceryList = [dinneriServingList, dinneriNameList, dinneriMeasuresList];

    //repeat for snack
    snackiServingList = [...snackiServingList, ...snackiServingArray];
    snackiNameList = [...snackiNameList, ...snackiNamesArray];
    snackiMeasuresList = [...snackiMeasuresList, ...snackiMeasuresArray];
    snackGroceryList = [snackiServingList, snackiNameList, snackiMeasuresList];

    //add all of the final list to their repective point in the final array
    finalGroceryList = [breakfastGroceryList, lunchGroceryList, dinnerGroceryList, snackGroceryList];

    console.log("finalGroceryList")
    console.log(finalGroceryList)
    //return the fianl array with all these values
    return finalGroceryList;
}

export async function saveAndStoreGroceryList(finalGroceryList){
    
    //get uid from session storage
    const uid = sessionStorage.getItem('userID');

    //get the grocery store plan date
    const groceryDate = JSON.parse(sessionStorage.getItem('groceryDate'));

    //make an empty array that will allow for the storing of the final grocery list to be combined into one
    let combinedList = [[],[],[]]

    //make the final Grocery list into on
    for (let i = 0; i < finalGroceryList.length; i++) {
        const singleMealList = finalGroceryList[i];
        
        console.log("single Meal list");
        console.log(singleMealList);

        combinedList = [[...combinedList[0], ...singleMealList[0]],[...combinedList[1], ...singleMealList[1]],[...combinedList[2], ...singleMealList[2]]]
    }

    //create an emptry food dicationary for the use of conparision
    let foodDict = {};

    //load each food item into the dictionary
    //check to see if the food value is in the dictionary
        //if it is then add the weight
        //if it isnt then add it to the dictionary
    for (let i = 0; i < combinedList[1].length; i++) {
        let weight = combinedList[0][i];
        let food = combinedList[1][i];
        let unit = combinedList[2][i];

        console.log("current food and dictionary")
        console.log(food)
        console.log(foodDict)

        if (food in foodDict) {
            foodDict[food].weight += weight;
            foodDict[food].unit = unit;
        } else {
            foodDict[food] = {weight: weight, unit: unit};
        }
    }

    //turn the final food dictionary into a food array
    const foodArray = Object.entries(foodDict).map(([food, {weight, unit}]) => [weight, food, unit]);

    const groceryData = {
        uid: uid,
        groceryList: foodArray,
    }

    console.log("var able type for grocery")
    
    //go to the collection
    // const groceryCollection = await collection(fsdb, 'mealPlans', uid, 'userGroceries');
    await setDoc(doc(fsdb, 'mealPlans', uid),{
        uid: uid
    }).then(()=>{
        setDoc(doc(fsdb, 'mealPlans', uid, 'userGroceries', groceryDate), groceryData)
    })

    console.log(foodArray);
    console.log(groceryDate);
    console.log(groceryData);
}