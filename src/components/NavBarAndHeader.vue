<template>
  <nav>
    <v-card class="overflow-hidden">
      <v-app-bar elevate-on-scroll color="grey" app>
        <!-- Make Navigation Bar and click action -->
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

        <!-- This will be a fare and balanced logo eventally -->
        <v-toolbar-title>Fare & Balanced</v-toolbar-title>

        <v-spacer></v-spacer>
        <!-- The current tab could be displayed -->

        <!-- Display the users avatar and display three dots -->
        <v-btn icon>
          <v-avatar color="primary">
            <v-icon> mdi-account-circle </v-icon>
          </v-avatar>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>
    </v-card>

    <!-- set up the display of the navigation bar -->
    <v-navigation-drawer v-model="drawer" absolute temporary app>
      <!-- make the list of the option in the navagtion bar -->
      <v-list nav dense>
        <v-subheader>MAIN MENU</v-subheader>
        <v-list-item
          v-for="(link, i) in navLinks"
          :key="i"
        >
          <v-list-item-content>
            <v-btn :href="link.route" v-if="link.text !== 'Logout'" class="navBtn">
              {{ link.text }}
            </v-btn>
            <v-btn @click="logout" v-else class="navBtn">
              {{ link.text }}
            </v-btn>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <!-- <v-list v-else nav dense>
        <v-subheader>MAIN MENU</v-subheader>
        <v-list-item
          v-for="(link, i) in navLinksAdmin"
          :key="i"
          :to="link.route"
          link
        >
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { clearHistory } from "../store/storeUsersInfo";
import router from "../router";

var isAdmin = sessionStorage.getItem("isAdmin");

export default {
  data: () => ({
    admin: isAdmin,
    navLinks: [
      { text: "Dashboard", icon: "mdi-home", route: "/" },
      { text: "Settings", icon: "mdi-clock", route: "/settings" },
      { text: "Meal Plans", icon: "mdi-account", route: "/meal_plans" },
      { text: "Recipes", icon: "mdi-account", route: "/recipes" },
      { text: "Grocery List", icon: "mdi-flag", route: "/grocery_list" },
      { text: "Analysis", icon: "mdi-flag", route: "/analysis" },
      { text: "Blog", icon: "mdi-flag", route: "/blog" },
      { text: "Support", icon: "mdi-flag", route: "/support" },
      { text: "Donate", icon: "mdi-flag", route: "/donate" },
      { text: "Logout", icon: "mdi-flag", route: "/login" },
    ],
    // navLinksAdmin: [
    //   { text: "Dashboard", icon: "mdi-home", route: "/" },
    //   { text: "Settings", icon: "mdi-clock", route: "/settings" },
    //   { text: "Meal Plans", icon: "mdi-account", route: "/meal_plans" },
    //   { text: "Recipes", icon: "mdi-account", route: "/recipes" },
    //   { text: "Grocery List", icon: "mdi-flag", route: "/grocery_list" },
    //   { text: "Analysis", icon: "mdi-flag", route: "/analysis" },
    //   { text: "Blog", icon: "mdi-flag", route: "/blog" },
    //   { text: "Support", icon: "mdi-flag", route: "/support" },
    //   { text: "Donate", icon: "mdi-flag", route: "/donate" },
    //   { text: "Admin", icon: "mdi-flag", route: "/admin" },
    //   { text: "Logout", icon: "mdi-flag", route: "/login" },
    // ],
    drawer: false,
    group: null,
  }),
  created() {
    // clearHistory();
    this.initialize();
    // let curAdmin = sessionStorage.getItem('isAdmin');

    // this.timer = setInterval(() => {
    //     console.log('checking to see if Admin');
    //     const newAdmin = sessionStorage.getItem('isAdmin');

    //     console.log('current Admin: ', curAdmin);
    //     console.log('new Admin: ', newAdmin);

    //     if (newAdmin !== curAdmin){
    //         curAdmin = newAdmin;
    //         sessionStorage.setItem('isAdmin', curAdmin);
    //         this.isAdmin = sessionStorage.getItem('isAdmin');
    //         this.lastChange = new Date();
    //     }

    // })
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
  methods: {
    initialize() {
      this.isAdmin = sessionStorage.getItem("isAdmin");
    },

    logout() {
      console.log("Logout!!")
      clearHistory();
      router.push('/login')
    },
  },
};
</script>

<style>
.navBtn {
  padding: 22px !important;
  box-shadow: 0px 0px 0px 0px;
  background-color: #fff !important;
}</style>
