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

            <div v-if="appointmentsFiltered.length == 0" class="d-flex flex-column align-center justify-center mt-4">
                <div class="text-subtitle-2">No appointments found.</div>
                <v-icon size="70" class="mt-4">mdi-calendar-remove</v-icon>
            </div>

            <v-data-iterator v-else :items="appointmentsFiltered" :items-per-page="6" :search="search">
                <template v-slot:default="{ items }">
                    <v-container class="pa-2" fluid>
                        <v-row dense>
                            <v-col v-for="item in items" :key="item._id" cols="auto" md="4" title="Click to see details">
                                <AppointmentCard :item="item.raw" :userRole="currentUserConnected.role"></AppointmentCard>
                            </v-col>
                        </v-row>
                    </v-container>
                </template>

                <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
                    <div class="d-flex align-center justify-center pa-4">
                    <v-btn
                        :disabled="page === 1"
                        density="comfortable"
                        icon="mdi-arrow-left"
                        variant="tonal"
                        rounded
                        @click="prevPage"
                    ></v-btn>

                    <div class="mx-2 text-caption">
                        Page {{ page }} of {{ pageCount }}
                    </div>

                    <v-btn
                        :disabled="page >= pageCount"
                        density="comfortable"
                        icon="mdi-arrow-right"
                        variant="tonal"
                        rounded
                        @click="nextPage"
                    ></v-btn>
                    </div>
                </template>
            </v-data-iterator>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '../../pinia_stores/authenticationStore';
import AppointmentCard from '@/components/AppointmentCard.vue';
import generalMixin from '@/commons/mixins';

export default {
    name: 'AppointmentsPage',
    mixins: [generalMixin],
    components: {
        AppointmentCard
    },
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
        },
        appointmentsFiltered() {
            return this.currentTab == "future" ? 
                this.appointmentsList.filter(ap => this.parseDateAndTimeString(ap.dateAndTime) > new Date()) :
                this.appointmentsList.filter(ap => this.parseDateAndTimeString(ap.dateAndTime) <= new Date());
            
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

    /* TODO: this should be set because of the search bar */
    /* overflow-x: hidden !important; */
}
</style>