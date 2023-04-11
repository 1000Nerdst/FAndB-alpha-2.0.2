import Vue from "vue";
import VueRouter from "vue-router";
import DashboardView from "../components/HomeScreen.vue";
import SettingsView from "../components/UserSettings.vue";
import MealPlanView from "../components/MealPlans.vue";
import RecipesView from "../components/RecipeDisplay.vue";
import GroceryListView from "../components/GroceryList.vue";
import LoginAndRegister from "../components/LoginAndRegister.vue";
import dbBaseAdmin from "../components/DataBaseAdmin.vue";
import DataAnalysis from "../components/DataAnalysis.vue";
import BlogNav from "../components/BlogNav.vue";
import SupportNav from "../components/SupportNav.vue";
import DonateNav from "../components/DonateNav.vue";
//import store from '../store/store'
// import auth from "../fb";
import VueSessionStorage from "vue-sessionstorage";
// import { doc, getDoc } from "firebase/firestore";
// import { db as fsdb } from '../fb'

Vue.use(VueRouter);
Vue.use(VueSessionStorage);

const routes = [
  { path: "/", name: "home", component: DashboardView, meta: { auth: true } },
  {
    path: "/settings",
    name: "settings",
    component: SettingsView,
    meta: { auth: true },
  },
  {
    path: "/meal_plans",
    name: "mealPlans",
    component: MealPlanView,
    meta: { auth: true },
  },
  {
    path: "/recipes",
    name: "recipes",
    component: RecipesView,
    meta: { auth: true },
  },
  {
    path: "/grocery_list",
    name: "groceryList",
    component: GroceryListView,
    meta: { auth: true },
  },
  {
    path: "/login",
    name: "login",
    component: LoginAndRegister,
    meta: { auth: false, hideNavbar: true },
  }, //make sure to add an admin fuction
  {
    path: "/admin",
    name: "admin",
    component: dbBaseAdmin,
    meta: { auth: true, admin: true },
  },
  {
    path: "/analysis",
    name: "analysis",
    component: DataAnalysis,
    meta: { auth: true },
  },
  { path: "/blog", name: "blog", component: BlogNav, meta: { auth: true } },
  {
    path: "/support",
    name: "support",
    component: SupportNav,
    meta: { auth: true },
  },
  {
    path: "/donate",
    name: "donate",
    component: DonateNav,
    meta: { auth: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = localStorage.getItem("userID");
  const isLogin = localStorage.getItem("isLogin");
  const isAdmin = localStorage.getItem("isAdmin");

  if (to.meta.auth && !currentUser && !isLogin) {
    localStorage.setItem("redirectPath", to.path);
    next("/login");
  } else if (to.meta.admin === true && isAdmin === "false" && !isLogin) {
    localStorage.setItem("redirectPath", to.path);
    next("/login");
  } else if (!to.meta.auth && (currentUser || isLogin) && !to.meta.admin) {
    next();
  } else if (
    to.meta.auth === true &&
    (currentUser || isLogin) &&
    to.meta.admin &&
    isAdmin === "true"
  ) {
    next();
  } else if (to.name === 'login' && isLogin === 'true') {
    next({ name: 'home' }); // redirect to home if already logged in
  } else if (isLogin === 'false') {
    next({ name: 'login' }); // redirect to login if not logged in
  } else {
    next();
  }
});


export default router;
