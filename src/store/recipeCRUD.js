import { db as fsdb } from '../fb'
import { collection, getDocs, onSnapshot, query, where, addDoc } from "firebase/firestore";


var iID

export default async function recipeCRUD(){
    console.log('after read and store');
}

export async function verifyIngredients(arrayCopy){
    console.log("making sure all ingredients are present")
    // var iID = getIngredientID()
    var allIds = []
    var i
    for(i = 0; i < arrayCopy.length; i++){
        var ingredientArray = arrayCopy[i]
        iID = await getIngredientID(ingredientArray)
        allIds.push(iID)
    }

    console.log('all ids: ',allIds)
}

async function getIngredientID(ingredientArray){
    
    console.log(ingredientArray)
    console.log('string: ', ingredientArray.ingredent)
    const ingredientRef = collection(fsdb, 'ingredientInfo')

    const q = query(ingredientRef, where("ingredientName", "==", ingredientArray.ingredent))

    console.log('idCheck')
    idCheck(q, ingredientArray).then(
        function(value) {console.log('logged value:', value)},
        function(error) {console.log('logged value error:', error)}
    )

    console.log('id')
}

async function idCheck(q, ingredientArray){

    onSnapshot(q, (snapshot) => {
        const ingredients = snapshot.docs
        //const test = snapshot.docs.map(doc => doc.data())
        if(ingredients.length != 0){
            console.log('idCheck onSnapshot',ingredients[0].id)
            iID = ingredients[0].id
            return iID
        }else{
            console.log('theres no value')
            iID = makeNewDoc(ingredientArray)
            console.log('idCheck onSnapshot else',iID)
            return iID
        }
    })
}

async function makeNewDoc(ingredientArray){
    const docRef = collection(fsdb, 'ingredientInfo')
    const docData = {
        ingredientName: ingredientArray.ingredent
    }

    const newDoc = await addDoc(docRef, docData)

    var newId = newDoc.id

    return newId
}

export async function getIDIngredents(ingredent){
    var currentID

    const ingredientRef = collection(fsdb, 'ingredientInfo')

    const q = query(ingredientRef, where("ingredientName", "==", ingredent))

    onSnapshot(q, (snapshot) => {
        const ingredients = snapshot.docs
        //const test = snapshot.docs.map(doc => doc.data())
        if(ingredients.length != 0){
            console.log('from snap shot: ', ingredients[0].id)
            currentID = ingredients[0].id
            return currentID
        }else{
            console.log('theres no value')
            console.log('getIngrientID onSnapshot else', currentID)
            // currentID = makeNewDoc(ingredientArray)
            return currentID
        }
    })
}

export async function getIId(arrayCopy, i){
    const cIngredent = arrayCopy[i].ingredent
    //var iID

    const ingredientRef = collection(fsdb, 'ingredientInfo')

    const q = query(ingredientRef, where("ingredientName", "==", cIngredent))
    const getDocResult = await getDocs(q)
    const result = getDocResult.docs.map((x) => x.id)

    if(result.length === 0){
        console.log('No items found')
        return undefined
    }else{
        console.log('array:', result)
        return result[0]
    }
}

export async function uploadToDB(len, recipeInfo, checkValuesArray, ingredentIDArray, ingredentNameArray, ingredentServingArray, ingredentMeasureArray, jsonFoods){

    console.log('uploading: ', jsonFoods)
    console.log('length: ', len)

    var calorieTotal = 0
    var carbTotal = 0
    var fatsTotal = 0
    var protienTotal = 0

    const obj = JSON.parse(JSON.stringify(await jsonFoods))
    console.log('jsonFoods: ', await jsonFoods)
    
    const servingServings = parseFloat(recipeInfo[4])
    console.log('serving size:', servingServings)

    for(var i = 0; i < len; i++){
        if(obj.foods[i].nf_calories != null){
            console.log('calories:', obj.foods[i].nf_calories)
            calorieTotal = calorieTotal + (await obj.foods[i].nf_calories /servingServings)
        }
        if(obj.foods[i].nf_total_carbohydrate != null){
            carbTotal = carbTotal + (obj.foods[i].nf_total_carbohydrate/servingServings)
        }
        if(obj.foods[i].nf_total_fat != null){
            fatsTotal = fatsTotal + (obj.foods[i].nf_total_fat/servingServings)
        }
        if(obj.foods[i].nf_protein != null){
            protienTotal = protienTotal + (obj.foods[i].nf_protein/servingServings)
        }
    }

    const docRef = collection(fsdb, 'recipeInfo')
    const docData = {
        recipeName: recipeInfo[0],
        recipeAuthor: recipeInfo[1],
        recipeDescription: recipeInfo[2],
        recipeInstruction: recipeInfo[3],
        isMainCourse: checkValuesArray[0],
        isSide: checkValuesArray[1],
        isMealPrep: checkValuesArray[2],
        isBreakfast: checkValuesArray[3],
        isLunch: checkValuesArray[4],
        isDinner: checkValuesArray[5],
        isSnack: checkValuesArray[6],
        iIds: ingredentIDArray,
        iNames: ingredentNameArray,
        iServings: ingredentServingArray,
        iMeasures: ingredentMeasureArray,
        totalCalories: calorieTotal,
        carbTotal: carbTotal,
        fatsTotal: fatsTotal,
        protienTotal: protienTotal
    }

    const newDoc = await addDoc(docRef, docData)

    var newId = newDoc.id
    console.log(newId)
}

export async function readAllRecipesName(){

}