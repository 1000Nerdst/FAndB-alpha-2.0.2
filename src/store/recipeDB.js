import { db as fsdb } from '../fb'
// import { collection, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function recipeDB (){
    console.log('db')
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

    // onSnapshot(q, (snapshot) => {
    //     const ingredientSnap = snapshot.docs
    //     if(ingredientSnap.length != 0){
    //         let ingredents = []
    //         console.log('idCheck onSnapshot 2',ingredientSnap[0].id)
    //         iID = ingredientSnap[0].id
    //         ingredents.push(iID)
    //         console.log('array: ', ingredents)
    //         return ingredents
    //     }else{
    //         console.log('theres no value')
    //         console.log('idCheck onSnapshot else 2',iID)
    //         return iID
    //     }
    // })

    // console.log('outside iiD: ', iID)
}