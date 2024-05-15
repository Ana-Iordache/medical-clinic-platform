<template>
  <v-toolbar class="sticky_header" color="#4091BE">
    <v-toolbar-title>
      <router-link :to="'/home'" class="text-white">
        {{ appTitle }}
      </router-link>
    </v-toolbar-title>

    <v-toolbar-items class="hidden-xs-only" color="white">
      <v-btn flat v-for="item in navigationItemsFiltered" :key="item.title" :to="item.path">
        {{ item.title }}
      </v-btn>

      <!-- Account item -->
      <v-menu open-on-hover>
        <template v-slot:activator="{ props }">
          <v-btn flat v-bind="props"> Account </v-btn>
        </template>

        <v-list>
          <v-list-item v-for="(item, index) in accountSectionSubItems" :key="index" :to="item.path">
            <v-list-item-title class="d-flex justify-start align-center"
              @click="item.title == 'Log out' ? logoutUser() : ''">
              <v-icon left dark>{{ item.icon }}</v-icon>
              <div class="ms-2">{{ item.title }}</div>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '../pinia_stores/authenticationStore';

export default {
  name: 'AppHeader',

  data: () => ({
    appTitle: "Medical clinic platform",
    userNavigationItems: [
      { title: 'Home',          path: '/home',          userRolesAccess: ['doctor', 'patient'], shouldBeLoggedIn: false },
      { title: 'Patients',      path: '/patients',      userRolesAccess: ['doctor'],            shouldBeLoggedIn: true },
      { title: 'Doctors',       path: '/doctors',       userRolesAccess: ['patient'],           shouldBeLoggedIn: false },
      { title: 'Appointments',  path: '/appointments',  userRolesAccess: ['doctor', 'patient'], shouldBeLoggedIn: true },
      { title: 'Feedback',      path: '/feedback',      userRolesAccess: ['doctor'],            shouldBeLoggedIn: true },
      { title: 'Earnings',      path: '/earnings',      userRolesAccess: ['doctor'],            shouldBeLoggedIn: true },
      { title: 'Services',      path: '/services',      userRolesAccess: ['patient'],           shouldBeLoggedIn: false },
      { title: 'Payments',      path: '/payments',      userRolesAccess: ['patient'],           shouldBeLoggedIn: true },
    ],
    accountSectionSubItems: [
      { title: 'Profile',           path: '/profile',           icon: 'mdi-account-circle' },
      { title: 'Settings',          path: '/settings',          icon: 'mdi-cog' },
      { title: 'Rate application',  path: '/rate_application',  icon: 'mdi-star' },
    ],
    currentTab: "",
    currentUserRole: "",
    userIsLoggedIn: false,
    auth: getAuth(),
  }),

  mounted() {
    this.auth = getAuth();

    onAuthStateChanged(this.auth, async user => {
      this.userIsLoggedIn = user ? true : false;
      if (this.userIsLoggedIn) {
        await this.authenticationStore.setCurrentUser(user.email);
        this.currentUserRole = this.authenticationStore.user.role;
        this.accountSectionSubItems[3] = { title: 'Log out', path: '/logout', icon: 'mdi-logout' };
      } else {
        this.authenticationStore.removeUser();
        this.currentUserRole = "";
        this.accountSectionSubItems[3] = { title: 'Log in', path: '/login', icon: 'mdi-login' };
      }
    })
  },

  computed: {
    ...mapStores(useAuthenticationStore),
    navigationItemsFiltered() {
      let itemsFiltered;
      if(this.userIsLoggedIn) {
        itemsFiltered = this.userNavigationItems.filter(item => item.userRolesAccess.includes(this.currentUserRole))
      } else {
        itemsFiltered = this.userNavigationItems.filter(item => !item.shouldBeLoggedIn)
      }
      return itemsFiltered
    }
  },

  methods: {
    logoutUser() {
      signOut(this.auth).then(() => {
        // console.log("User signed out.");
        this.$router.push({ path: "/login" })
      })
    }
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: #000000DE;
}

.sticky_header {
  position: sticky !important;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}
</style>