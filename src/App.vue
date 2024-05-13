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
  /* margin: 2rem; */
  height: 100vh;
}

.form_title {
  text-align: center;
  margin-bottom: 2rem;
}

.custom_form {
  margin-top: 2rem;
}

.page_content_overlay {
  background: rgba(64, 145, 190, 0.25);
  box-shadow: 0px 0px 10px 6px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(5px);
  /* Note: backdrop-filter has minimal browser support */
  border-radius: 10px 10px 0px 0px;
  height: 100%;
  margin: 0 3rem;
  overflow: auto;
}

.page_title {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
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

html {
  overflow: hidden !important;
}

/**
* VMain
*/
.v-main {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
  height: 100vh;
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

/* User info */
/* TODO: something is not ok with overflow here */
.user_info_card {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow: auto !important;
}

.user_info_card .profile_photo_section {
  width: fit-content;
}

.user_info_card .info_section {
  flex-grow: 1;
  padding: 1rem;
}

.user_info_card_section {
  border: 1px solid #c6c6c6;
  border-radius: .5rem;
  margin: 1rem;
}
</style>