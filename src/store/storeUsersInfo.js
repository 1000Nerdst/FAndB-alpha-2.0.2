import { doc, getDoc, getDocs, collection, query } from "firebase/firestore";
import { db as fsdb } from "../fb";

export async function storeUserDataLocal(uid) {
  await readFromDB(uid);
}

export async function clearHistory() {
  localStorage.setItem("userID", "");
  localStorage.setItem("activeDaysPerWeek", 0);
  localStorage.setItem("calorieTarget", 0);
  localStorage.setItem("carbsGrams", 0);
  localStorage.setItem("carbsRatio", 0);
  localStorage.setItem("fatGrams", 0);
  localStorage.setItem("fatRatio", 0);
  localStorage.setItem("goal", "");
  localStorage.setItem("heightF", 0);
  localStorage.setItem("maintenceTarget", 0);
  localStorage.setItem("protienGrams", 0);
  localStorage.setItem("proteinRatio", 0);
  localStorage.setItem("sex", "");
  localStorage.setItem("weightLb", 0);
  localStorage.setItem("age", 0);
  localStorage.setItem("isAdmin", false);
  localStorage.setItem("isLogin", false);
  localStorage.setItem("isInvestor", false);
  // localStorage.setItem('breakfastGroceryList', JSON.stringify([]))
  // localStorage.setItem('lunchGroceryList', JSON.stringify([]))
  // localStorage.setItem('dinnerGroceryList', JSON.stringify([]))
  // localStorage.setItem('snackGroceryList', JSON.stringify([]))
}

export default function storeUsersInfo() {
  console.log("wrong function called");
}

async function readFromDB(uid) {
  localStorage.setItem("uid", uid);
  const docRef = doc(fsdb, "userData", uid);
  const infoDoc = doc(fsdb, "userInfo", uid);
  const infoCol = query(collection(fsdb, "mealPlans", uid, "userMealPlan"));
  const docSnap = await getDoc(docRef);
  const docSnap1 = await getDocs(infoCol);
  var mealDates = [];
  docSnap1.forEach((x) => {
    mealDates.push(x.id);
  });
  var groceryDate = [];
  for (let i = 0; i < mealDates.length; i++) {
    const infoCol1 = doc(fsdb, "mealPlans", uid, "userMealPlan", mealDates[i]);
    const docSnap2 = await getDoc(infoCol1);

    if (docSnap2.exists()) {
      groceryDate.push(docSnap2.data().groceryDate);
    } else {
      console.log("Not exists");
    }
  }
  localStorage.setItem("mealDates", mealDates);
  localStorage.setItem("groceryDate", groceryDate);
  localStorage.getItem("mealDates", mealDates);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    localStorage.setItem("userID", uid);
    localStorage.setItem("activeDaysPerWeek", docSnap.data().activeDaysPerWeek);
    localStorage.setItem("calorieTarget", docSnap.data().calorieTarget);
    localStorage.setItem("carbsGrams", docSnap.data().carbsGrams);
    localStorage.setItem("carbsRatio", docSnap.data().carbsRatio);
    localStorage.setItem("fatGrams", docSnap.data().fatGrams);
    localStorage.setItem("fatRatio", docSnap.data().fatRatio);
    localStorage.setItem("goal", docSnap.data().goal);
    localStorage.setItem("heightF", docSnap.data().heightF);
    localStorage.setItem("maintenceTarget", docSnap.data().maintenceTarget);
    localStorage.setItem("protienGrams", docSnap.data().protienGrams);
    localStorage.setItem("proteinRatio", docSnap.data().proteinRatio);
    localStorage.setItem("sex", docSnap.data().sex);
    localStorage.setItem("weightLb", docSnap.data().weightLb);
    localStorage.setItem("age", docSnap.data().age);
    localStorage.setItem("maintenceTarget", docSnap.data().maintenceTarget);
  } else {
    console.log("No such document!");
  }

  const docInfoSnap = await getDoc(infoDoc);

  if (docInfoSnap.exists()) {
    console.log("Information Data:", docInfoSnap.data());
    localStorage.setItem("isAdmin", docInfoSnap.data().staff);
    localStorage.setItem("isLogin", true);
    localStorage.setItem("isInvestor", docInfoSnap.data().investor);
  } else {
    console.log("No such document!");
  }
}
