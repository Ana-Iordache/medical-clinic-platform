<template>
  <v-toolbar class="sticky_header">
    <v-toolbar-title>
      <router-link :to="'/home'">
        {{ appTitle }}
      </router-link>
    </v-toolbar-title>

    <v-toolbar-items class="hidden-xs-only">
      <v-btn flat> Test </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>

export default {
  name: 'AppHeader',

  data: () => ({
    appTitle: "Medical clinic platform"
  }),
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: #000000DE;
}
</style>