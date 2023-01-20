<template>
  <!-- make card with header and nav bar and make sure it always show -->
    <v-card
        class="overflow-hidden"
        >
        <!-- system bar can be created at a later time -->
        <!-- make app bar -->
        <v-app-bar
        elevate-on-scroll
        color="grey"
        >
            <!-- Make Navigation Bar and click action -->
            <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

            <!-- This will be a fare and balanced logo eventally -->
            <v-toolbar-title>Fare & Balanced</v-toolbar-title>

            <v-spacer></v-spacer>
            <!-- The current tab could be displayed -->

            <!-- Display the users avatar and display three dots -->
            <v-btn
            icon>
                <v-avatar
                color="primary"
                >
                    <v-icon>
                        mdi-account-circle
                    </v-icon>
                </v-avatar>
            </v-btn>
            <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>

            <!-- set up the display of the navigation bar -->
        </v-app-bar>
    </v-card>
</template>

<script>
export default {
    data: () => ({
        options: [
            { text: 'Settings', icon: 'mdi-clock' },
            { text: 'Meal Plans', icon: 'mdi-account' },
            { text: 'Grocery List', icon: 'mdi-flag' },
            { text: 'Analysis', icon: 'mdi-flag' },
            { text: 'Blog', icon: 'mdi-flag' },
            { text: 'Support', icon: 'mdi-flag' },
            { text: 'Donate', icon: 'mdi-flag' },
            { text: 'Logout', icon: 'mdi-flag' },
        ],
        drawer: false,
        group: null,
        }),
        watch: {
            group () {
                this.drawer = false
           },
        },
}
</script>

<style>

</style>