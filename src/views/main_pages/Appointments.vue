<template>
    <div id="appointment_container" class="page_container">
        <div class="text-h4 page_title"> Appointments </div>
        <div class="page_content_overlay">
            <div class="d-flex flex-row justify-space-between">
                <v-btn class="ma-3" :variant="currentTab == 'history' ? 'tonal' : 'text'" @click="changeTab('history')">
                    History
                </v-btn>
                <v-btn class="ma-3" :variant="currentTab == 'future' ? 'tonal' : 'text'" @click="changeTab('future')">
                    Future
                </v-btn>

                <!-- TODO: move this to the right -->
                <v-toolbar color="transparent">
                    <v-text-field
                        v-model="search"
                        density="comfortable"
                        placeholder="Search"
                        prepend-inner-icon="mdi-magnify"
                        style="max-width: 300px"
                        variant="solo"
                        clearable
                        hide-details
                    ></v-text-field>
                </v-toolbar>
            </div>

            <v-divider color="white" class="border-opacity-50 ma-2"></v-divider>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '../../pinia_stores/authenticationStore';

export default {
    name: 'AppointmentsPage',
    data: () => ({
        currentTab: 'future',
        search: "",
        appointmentsList: []
    }),
    async mounted() {
        if(this.currentUserConnected)
            await this.loadAppointments();
    },
    computed: {
        ...mapStores(useAuthenticationStore),
        currentUserConnected() {
            return this.authenticationStore.user;
        }
    },
    watch: {
        async currentUserConnected(newUser) {
            if(newUser) {
                await this.loadAppointments();
            }
        }
    },
    methods: {
        changeTab(tab) {
            this.currentTab = tab;
        },
        loadAppointments() {
            return new Promise(resolve => {
                this.axios.get(`/users/${this.currentUserConnected.email}/appointments?role=${this.currentUserConnected.role}`)
                    .then(response => this.appointmentsList = response.data)
                    .catch(error => console.error(error))
                    .finally(() => resolve());
            })
        }
    }
}
</script>

<style>
#appointment_container {
    background: url('../../assets/appointments.jpg') no-repeat;
    background-size: cover;
    height: 100vh;
}
</style>