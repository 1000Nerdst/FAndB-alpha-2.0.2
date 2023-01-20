<template>
    <!-- set up the display of the navigation bar -->
    <v-navigation-drawer
    v-model="drawer"
    absolute
    bottom
    temporary
    app>
        <!-- make the list of the option in the navagtion bar -->
        <v-list
        nav
        dense>
            <v-subheader>MAIN MENU</v-subheader>
            <v-list-item-group
            v-model="selectedItem"
            active-class="deep-purple--text text--accent-4"
            color="blue">
                <v-list-item
                v-for="(option, i) in options"
                :key="i">
                    <v-list-item-content>
                        <v-list-item-title v-text="option.text"></v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
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
