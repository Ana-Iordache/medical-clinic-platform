<template>
    <v-card class="pb-3 pointer_on_hover" border flat>
        <div class="text-h6 text-center"> {{ item.specialization }} </div>

        <div class="d-flex flex-row justify-space-around ma-2">
            <div class="d-inline-flex">
                <v-icon>mdi-clock-time-eight</v-icon>
                <div class="px-1"> {{ getTimeFromDate(parseDateAndTimeString(item.dateAndTime)) }} </div>
            </div>
            <div class="d-inline-flex">
                <v-icon>mdi-calendar</v-icon>
                <div class="px-1"> {{ getDateStringFromDate(parseDateAndTimeString(item.dateAndTime)) }} </div>
            </div>
        </div>

        <v-divider color="#c6c6c6" class="border-opacity-50 mx-4 mt-4"></v-divider>

        <v-list>
            <v-list-item :title="`Dr. ${item.doctorFullName}`" :subtitle="getValueIfNotEmpty(item.doctorProfessionalDegree)"></v-list-item>
        </v-list>

        <v-divider color="#c6c6c6" class="border-opacity-50 mx-4 mb-4"></v-divider>

        <div class="d-flex justify-center align-center text-button" :class="getColorClass(item.status)">
            <div> {{ item.status }} </div>
            <v-icon>{{ getIconStatus(item.status) }}</v-icon>
        </div>

        <!-- TODO: identity and health card -->
        <div class="d-flex flex-row justify-space-around flex-grow-1">
            <v-btn variant="tonal" color="#4091BE" append-icon="mdi mdi-download" @click="downloadPrescription(item.prescriptionUrl)">
                Prescription
            </v-btn>
            <v-btn variant="tonal" color="#4091BE" append-icon="mdi mdi-star" @click="openFeedbackDialog()">
                Feedback
            </v-btn>
        </div>
    </v-card>
</template>

<script>
import generalMixin from '@/commons/mixins';
export default {
    name: "AppointmentCard",
    mixins: [generalMixin],
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    methods: {
        getIconStatus(status) {
            switch(status) {
                case "honored":
                    return "mdi-calendar-check";
                case "unhonored":
                case "canceled":
                    return "mdi-calendar-remove";
                case "unset":
                    return "mdi-calendar-question";
            }
        },
        getColorClass(status) {
            switch(status) {
                case "honored":
                    return "text-green";
                case "unhonored":
                case "canceled":
                    return "text-red";
                case "unset":
                    return "text-orange";
            }
        },
        downloadPrescription(url) {
            console.log("TODO: downloadPrescription ", url)
        },
        openFeedbackDialog() {
            console.log("TODO openFeedbackDialog")
        }
    }
}
</script>