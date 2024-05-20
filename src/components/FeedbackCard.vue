<template>
    <v-card width="30%" border flat class="ma-3">
        <v-card-title>
            <div class="d-flex flex-row align-center justify-center">
                {{ cardTitle }}
               <v-icon size="small">mdi-star</v-icon>
            </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
            {{ feedback.review }}
        </v-card-text>
        <v-card-actions class="d-flex justify-space-between justify-center">
        <!-- TODO: align this to the bottom of the card -->
            <div class="text-center font-weight-light">
                {{ getDateStringFromDate(parseDateAndTimeString(feedback.dateAndTime)) }}
            </div>
            <v-btn icon="mdi-calendar-search" :title="'See appointment'" @click="openAppointmentDetailsDialog(true)">
            </v-btn>
        </v-card-actions>
    </v-card>
    
    <v-dialog v-model="appointmentDetailsDialog.show" width="30%">
       <AppointmentCard :item="appointmentDetailsDialog.data" :user-role="'doctor'" :isInFuture="false"></AppointmentCard>
    </v-dialog>
</template>

<script>
import generalMixin from '@/commons/mixins';
import AppointmentCard from '@/components/AppointmentCard.vue';

export default {
    name: "FeedbackCard",
    mixins: [generalMixin],
    components: {
        AppointmentCard
    },
    props: {
        feedback: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        appointmentDetailsDialog: {
            show: false,
            data: null
        }
    }),
    computed: {
        cardTitle() {
            return `${this.feedback.rating}/5`;
        }
    },
    methods: {
        async openAppointmentDetailsDialog(show) {
            this.appointmentDetailsDialog.data = show ? await this.getAppointment(this.feedback.appointmentId) : null;
            this.appointmentDetailsDialog.show = show;
        },
        getAppointment(appointmentId) {
            return new Promise(resolve => {
                this.axios.get(`/appointments/${appointmentId}`)
                .then(response => resolve(response.data))
                .catch(() => resolve(null));
            })
        }
    }
}
</script>