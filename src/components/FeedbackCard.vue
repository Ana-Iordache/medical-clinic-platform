<template>
    <v-card width="30%" border flat>
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
            <v-btn icon="mdi-calendar-search" :title="'See appointment'" @click="openAppointmentDetailsDialog">
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import generalMixin from '@/commons/mixins';

export default {
    name: "FeedbackCard",
    mixins: [generalMixin],
    props: {
        feedback: {
            type: Object,
            required: true
        }
    },
    data: () => ({

    }),
    computed: {
        cardTitle() {
            return `${this.feedback.rating}/5`;
        }
    },
    methods: {
        openAppointmentDetailsDialog() {
            console.log("appointment id: ", this.feedback.appointmentId)
        }
    }
}
</script>