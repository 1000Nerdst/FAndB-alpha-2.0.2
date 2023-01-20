<template>
  <v-app>
    <template>
      <!-- Side bar -->
      <!-- <v-navigation-drawer>
        
      </v-navigation-drawer> -->

      <!-- Header -->
      <NavBarAndHeader v-if="!$route.meta.hideNavbar" />

      <!-- <AppHeader/>
      <NavagatorDisplay/> -->

      <!-- Size content of app based on app components -->
      <v-main>
        <router-view></router-view>
      </v-main>
    </template>

    <!-- <template v-else>
      <v-main>
        <v-container>
          <LoginAndRegister/>
        </v-container>
      </v-main>
    </template> -->
    <!-- <template v-else>
      <v-main>
        <v-container>
          <LoginAndRegister/>
        </v-container>
      </v-main>
    </template> -->
  </v-app>
</template>

<script>
// import AppHeader from "./components/AppHeader.vue";
// import NavagatorDisplay from "./components/NavagatorDisplay.vue";
//import HomeScreen from "./components/HomeScreen.vue";
import NavBarAndHeader from "./components/NavBarAndHeader.vue";
// import LoginAndRegister from "./components/LoginAndRegister.vue"

export default {
  name: "App",
  logged_in: false,

  components: {
    // AppHeader,
    // NavagatorDisplay,
    //HomeScreen,
    NavBarAndHeader,
    // LoginAndRegister
  },

  data: () => ({
    logged_in: false,
  }),
};
</script>
