<template>
    <v-app id="app" standalone>
        <v-toolbar fixed class="green">
            <v-toolbar-title class="white--text">
                Test Cards OCR
            </v-toolbar-title>
        </v-toolbar>
        <main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </main>
            <v-footer class="pa-5 green">
            <span class="white--text">© {{ new Date().getFullYear() }} Loop 3.0</span>
        </v-footer>
    </v-app>
</template>

<script>
export default {

}
</script>


