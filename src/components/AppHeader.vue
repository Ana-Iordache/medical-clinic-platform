<template>
  <v-toolbar class="sticky_header">
    <v-toolbar-title>
      <router-link :to="'/home'">
        {{ appTitle }}
      </router-link>
    </v-toolbar-title>

    <v-toolbar-items class="hidden-xs-only">
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
              @click="item.title == 'Logout' ? logoutUser() : ''">
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

export default {
  name: 'AppHeader',

  data: () => ({
    appTitle: "Medical clinic platform",
    userNavigationItems: [
      { title: 'Home', path: '/home', userRolesAccess: ['doctor', 'patient'] },
      { title: 'Patients', path: '/patients', userRolesAccess: ['doctor'] },
      { title: 'Appointments', path: '/appointments', userRolesAccess: ['doctor', 'patient'] },
      { title: 'Feedback', path: '/feedback', userRolesAccess: ['doctor'] },
      { title: 'Earnings', path: '/earnings', userRolesAccess: ['doctor'] },
      { title: 'Services', path: '/services', userRolesAccess: ['patient'] },
      { title: 'Payments', path: '/payments', userRolesAccess: ['patient'] },
    ],
    accountSectionSubItems: [
      { title: 'Profile', path: '/profile', icon: 'mdi-account-circle' },
      { title: 'Settings', path: '/settings', icon: 'mdi-cog' },
      { title: 'Rate application', path: '/rate_application', icon: 'mdi-star' },
      { title: 'Log out', path: '/logout', icon: 'mdi-logout' },
    ],
    currentTab: "",
    currentUserRole: 'doctor' // TODO: get real current user
  }),

  computed: {
    navigationItemsFiltered() {
      return this.userNavigationItems.filter(item => item.userRolesAccess.includes(this.currentUserRole))
    }
  },

  methods: {
    // TODO: logoutUser
    logoutUser() {
      console.log("logoutUser")
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