import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardView from '../components/HomeScreen.vue'
import SettingsView from '../components/UserSettings.vue'
import MealPlanView from '../components/MealPlans.vue'
import RecipesView from '../components/RecipeDisplay.vue'
import GroceryListView from '../components/GroceryList.vue'
import LoginAndRegister from '../components/LoginAndRegister.vue'
import dbBaseAdmin from '../components/DataBaseAdmin.vue'
import DataAnalysis from "../components/DataAnalysis.vue"
import BlogNav from "../components/BlogNav.vue"
import SupportNav from "../components/SupportNav.vue"
import DonateNav from "../components/DonateNav.vue"
//import store from '../store/store'
//import { component } from 'vue/types/umd'
import auth from '../fb'
import VueSessionStorage from 'vue-sessionstorage'
// import { doc, getDoc } from "firebase/firestore"; 
// import { db as fsdb } from '../fb'

Vue.use(VueRouter)
Vue.use(VueSessionStorage)

//auth: false -> meta: { auth: true } in the future
const routes = [
  { path: '/', name: 'home', component: DashboardView, meta: { auth: true } },
  { path: '/settings', name: 'settings', component: SettingsView, meta: { auth: true } },
  { path: '/meal_plans', name: 'mealPlans', component: MealPlanView, meta: { auth: true } },
  { path: '/recipes', name: 'recipes', component: RecipesView, meta: { auth: true } },
  { path: '/grocery_list', name: 'groceryList', component: GroceryListView, meta: { auth: true } },
  { path: '/login', name: 'login', component: LoginAndRegister, meta: { auth: false,hideNavbar:true } }, //make sure to add an admin fuction
  { path: '/admin', name: 'admin', component: dbBaseAdmin, meta: { auth: true, admin:true } },
  { path: '/analysis', name: 'analysis', component: DataAnalysis, meta: { auth: true } },
  { path: '/blog', name: 'blog', component: BlogNav, meta: { auth: true } },
  { path: '/support', name: 'support', component: SupportNav, meta: { auth: true } },
  { path: '/donate', name: 'donate', component: DonateNav, meta: { auth: true } }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  //var uid = currentUser.uid;
  //go into firestore and open the currentUser by udit and see if they are admin
  
  const isAdmin = sessionStorage.getItem('isAdmin');
  console.log('is admin:', isAdmin);
  if(to.meta.auth && !currentUser){
    sessionStorage.setItem('redirectPath', to.path);
    console.log('is admin: not logged in');
    next('/login');
  }else if(to.meta.admin === true && isAdmin === false){
    sessionStorage.setItem('redirectPath', to.path);
    console.log('is admin: not admin');
    next('/login');
  }else if(!to.meta.auth && currentUser && !to.meta.admin){
    console.log('is admin: no admin req');
    next();
  }
  else if(to.meta.auth === true && currentUser && to.meta.admin && isAdmin === true){
    console.log('admin loggin');
    next();
  }else{
    console.log('is admin: else');
    next();
  }
  //console.log(store)
  // const publicPages = ['/login'];
  // const requiredAuth = !publicPages.includes(to.path);
  // const currentUser = auth.currentUser;

  // if(requiredAuth && !currentUser){
  //   sessionStorage.setItem('redirectPath', to.path)
  //   return next('/login');
  // }else if(requiredAuth && currentUser){
  //   next();
  // }else{
  //   next();
  // }
})
export default router
