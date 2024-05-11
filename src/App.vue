<template>
  <v-app>
    <v-main>
      <AppHeader />
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>
import AppHeader from './components/AppHeader.vue'

export default {
  name: 'App',

  components: {
    AppHeader,
  },

  data: () => ({
    //
  }),
}
</script>

<style>
.page_container {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 2rem;
}

.form_title {
  text-align: center;
  margin-bottom: 2rem;
}

.custom_form {
  margin-top: 2rem;
}

/**
* Scrollbar
*/
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: .5rem;
  background-color: #F5F5F5;
}

::-webkit-scrollbar {
  width: .6rem;
  height: .4rem;
  background-color: #F5F5F5;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
  background-color: rgb(177, 177, 177);
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgb(156, 156, 156);
}

/**
* VMain
*/
.v-main {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  /* overflow: auto; */
}

.remember_me_checkbox .v-checkbox-btn {
  color: white !important;
}

.remember_me_checkbox .v-checkbox-btn .v-label--clickable:hover {
  opacity: 1;
}

.form_container {
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

/** Login and Signup */
.second_section {
  display: flex;
  flex-direction: column;
  background: #4091BE;
  box-shadow: inset 5px 0px 25px 10px rgba(0, 0, 0, 0.2);
  width: 40%;
}

.form_inputs_section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 5rem 0 5rem;
}

.pointer_on_hover:hover {
  cursor: pointer;
}
</style>