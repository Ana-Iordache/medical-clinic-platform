<template>
    <div id="appointment_container" class="page_container">
        <div class="text-h4 page_title"> Appointments </div>
        <div class="page_content_overlay">
            <div class="d-flex flex-row justify-space-between">
                <v-toolbar color="transparent" class="px-4">
                    <div>
                        <v-btn class="me-1" color="#4091BE" :variant="currentTab == 'history' ? 'tonal' : 'text'" @click="changeTab('history')">
                            History
                        </v-btn>
                        <v-btn class="ms-1" color="#4091BE" :variant="currentTab == 'future' ? 'tonal' : 'text'" @click="changeTab('future')">
                            Future
                        </v-btn>
                    </div>
                    <div class="d-flex align-center">
                        <v-btn v-if="currentUserConnected && currentUserConnected.role == 'patient'" 
                            class="me-2" 
                            variant="outlined" 
                            append-icon="mdi-calendar-plus" 
                            color="#4091BE" 
                            @click="openAddAppointmentDialog(true)"
                        >Add</v-btn>
                        <v-text-field
                            v-model="search"
                            density="comfortable"
                            placeholder="Search"
                            prepend-inner-icon="mdi-magnify"
                            width="300px"
                            variant="solo"
                            clearable
                            hide-details
                        ></v-text-field>
                    </div>
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
                                <AppointmentCard :isInFuture="currentTab == 'future'" 
                                    :item="item.raw" 
                                    :userRole="currentUserConnected.role"
                                    @cancel-appointment="onCancelAppointment"></AppointmentCard>
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

    <v-dialog v-model="showAddAppointmentDialog" max-width="80%">
        <AddNewAppointmentCard @appointment-creation-canceled="openAddAppointmentDialog(false)"
            @appointment-added="appointmentAdded"
            :patientEmail="currentUserConnected.email"></AddNewAppointmentCard>
    </v-dialog>

    <v-snackbar v-model="confirmation.show"
        :timeout="4000" 
        :color="confirmation.success ? 'green-lighten-1' : 'red-lighten-1'" 
        variant="tonal">
        <v-icon>{{ confirmation.success ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}</v-icon>
        {{ confirmation.message }}
    </v-snackbar>

    <v-dialog v-model="cancelAppointmentDialog.show" width="80%">
        <v-card class="pa-3 text-center">
            <v-card-title>Are you sure you want to cancel this appointment?</v-card-title>
            <v-spacer></v-spacer>

            <v-card-actions class="align-self-center">
                <v-btn variant="tonal" color="teal-darken-1" text="Yes" @click="cancelAppointment"></v-btn>
                <v-btn variant="tonal" text="No" @click="openCancelAppointmentDialog(false)"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '../../pinia_stores/authenticationStore';
import AppointmentCard from '@/components/AppointmentCard.vue';
import AddNewAppointmentCard from '@/components/AddNewAppointmentCard.vue';
import generalMixin from '@/commons/mixins';

export default {
    name: 'AppointmentsPage',
    mixins: [generalMixin],
    components: {
        AppointmentCard,
        AddNewAppointmentCard
    },
    data: () => ({
        currentTab: 'future',
        search: "",
        appointmentsList: [],
        showAddAppointmentDialog: false,
        confirmation: {
            show: false,
            success: true,
            message: ""
        },
        cancelAppointmentDialog: {
            show: false,
            id: null
        }
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
        },
        openAddAppointmentDialog(show) {
            this.showAddAppointmentDialog = show;
        },
        openCancelAppointmentDialog(show) {
            this.cancelAppointmentDialog.show = show;
        },
        async appointmentAdded(confirmation, message) {
            this.confirmation = {
                show: true,
                success: confirmation,
                message: message
            }

            this.openAddAppointmentDialog(false);

            // update appointments list
            if(confirmation) {
                await this.loadAppointments();
            }
        },
        onCancelAppointment(appointmentId) {
            this.cancelAppointmentDialog.id = appointmentId
            this.openCancelAppointmentDialog(true);
        },
        cancelAppointment() {
            console.log("appintment to cancel: ", this.cancelAppointmentDialog.id)
            this.openCancelAppointmentDialog(false);
        }
    }
}
</script>

<style scoped>
#appointment_container {
    background: url('../../assets/appointments.jpg') no-repeat;
    background-size: cover;
    height: 100vh;
}
</style>