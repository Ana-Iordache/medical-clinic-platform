<template>
    <v-card class="pb-3" border flat>
        <div class="d-flex justify-end mt-2 mx-2">
            <v-btn v-if="isInFuture"
                :disabled="isCanceled"
                color="red"
                @click="openCancelAppointmentDialog(true)" 
                title="Cancel appointment"
                variant="text"
                icon="mdi-calendar-remove"
                density="compact"
            ></v-btn>
        </div>

        <div class="text-h6 text-center"> {{ cardTitle }} </div>

        <div class="d-flex flex-row justify-space-around ma-2">
            <div class="d-inline-flex">
                <v-icon>mdi-clock-time-eight</v-icon>
                <div class="px-1"> {{ formatTimeFromDate(parseDateAndTimeString(item.dateAndTime), true) }} </div>
            </div>
            <div class="d-inline-flex">
                <v-icon>mdi-calendar</v-icon>
                <div class="px-1"> {{ getDateStringFromDate(parseDateAndTimeString(item.dateAndTime)) }} </div>
            </div>
        </div>

        <div v-if="userRole == 'patient'">
            <v-divider color="#c6c6c6" class="border-opacity-50 mx-4 mt-4"></v-divider>

            <v-list>
                <v-list-item :title="`Dr. ${item.doctorFullName}`" :subtitle="getValueIfNotEmpty(item.doctorProfessionalDegree)"></v-list-item>
            </v-list>
        </div>

        <v-divider color="#c6c6c6" class="border-opacity-50 mx-4 mb-2"></v-divider>

        <div class="d-flex justify-center align-center text-button mb-2" :class="getColorClass(item.status)">
            <div> {{ item.status }} </div>
            <v-icon>{{ getIconStatus(item.status) }}</v-icon>
        </div>

        <!-- TODO: Prescription and Feedback -->
        <div v-if="userRole == 'patient'" class="d-flex flex-row justify-space-around flex-grow-1 flex-wrap">
            <v-btn variant="tonal" color="#4091BE" append-icon="mdi mdi-download" @click="downloadPrescription(item.prescriptionUrl)">
                Prescription
            </v-btn>
            <v-btn :disabled="isCanceled" :variant="isCanceled ? 'outlined' : 'tonal'" color="#4091BE" append-icon="mdi mdi-star" @click="openFeedbackDialog(true)">
                Feedback
            </v-btn>
        </div>

        <div v-if="userRole == 'doctor'" class="d-flex justify-center">
            <v-btn variant="tonal" color="#4091BE" 
                :append-icon="item.prescriptionUrl ? 'mdi mdi-download' : 'mdi mdi-upload'" 
                @click="item.prescriptionUrl ? downloadPrescription(item.prescriptionUrl) : uploadPrescription()">
                Prescription
            </v-btn>
        </div>
    </v-card>    

    <v-dialog v-model="showCancelAppointmentDialog" width="fit-content">
        <v-card class="pa-3 text-center">
            <v-card-title>Are you sure you want to cancel this appointment?</v-card-title>
            <v-spacer></v-spacer>

            <v-card-actions class="align-self-center">
                <v-btn variant="tonal" color="teal-darken-1" text="Yes" @click="cancelAppointment"></v-btn>
                <v-btn variant="tonal" text="No" @click="openCancelAppointmentDialog(false)"></v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showFeedbackDialog" width="60%">
        <v-card class="pa-3"  color="#4091BE">
            <v-card-title>Feedback for Dr. {{ item.doctorFullName }}</v-card-title>
            <v-spacer></v-spacer>

            <v-rating
                v-model="feedback.rating"
                half-increments
                hover
                :readonly="itHasFeedback"
            ></v-rating>

            <v-textarea
                v-model="feedback.review"
                variant="solo"
                maxlength="300"
                placeholder="Write your review here..."
                counter
                :rules="[rules.requiredField]"
                ref="textarea_review"
                :readonly="itHasFeedback">
            </v-textarea>

            <v-card-actions class="align-self-center">
                <v-btn v-if="!itHasFeedback" variant="tonal" @click="sendFeedback">Send</v-btn>
                <v-btn variant="tonal" @click="openFeedbackDialog(false)"> {{ !itHasFeedback ? 'Cancel' : 'Close' }} </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import generalMixin from '@/commons/mixins';
export default {
    name: "AppointmentCard",
    mixins: [generalMixin],
    emits: ["appointment-updated"],
    props: {
        item: {
            type: Object,
            required: true
        },
        userRole: {
            type: String,
            required: true
        },
        isInFuture: {
            type: Boolean,
            default: true
        }
    },
    data: () => ({
        showCancelAppointmentDialog: false,
        showFeedbackDialog: false,
        feedback: {
            rating: 0,
            review: ""
        }
    }),
    computed: {
        cardTitle() {
            return this.userRole == 'patient' ? this.item.specialization : this.item.patientFullName;
        },
        isCanceled() {
            return this.item.status == 'canceled';
        },
        itHasFeedback() {
            return this.item.feedback;
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
        uploadPrescription() {
            console.log("TODO uploadPrescription")
        },

        async cancelAppointment() {
            const body = {
                field: "status",
                value: "canceled"
            }
            await this.updateAppointment(body);
            this.openCancelAppointmentDialog(false);
        },
        openCancelAppointmentDialog(show) {
            this.showCancelAppointmentDialog = show;
        },

        
        openFeedbackDialog(show) {
            if(show && this.item.feedback) {
                this.feedback = {
                    rating: this.item.feedback.rating,
                    review: this.item.feedback.review
                }
            } else {
                this.feedback = {
                    rating: 0,
                    review: ""
                }
            }
            this.showFeedbackDialog = show;
        },
        async sendFeedback() {
            const validation = await this.$refs.textarea_review.validate();
            if(!validation[0]) {
                await this.addFeeback(this.feedback);
            }
        },
        async addFeeback(feedback) {
            const body = {
                field: "feedback",
                value: feedback
            }
            await this.updateAppointment(body);
            this.openFeedbackDialog(false);
        },

        async updateAppointment(body) {
            return new Promise(resolve => {
                this.axios.patch(`/appointments/${this.item._id}`, body)
                .then((response) => {
                    this.$emit("appointment-updated", true, response.data.message, this.item._id, body);
                })
                .catch((error) => {
                    this.$emit("appointment-updated", false, error.response.data.message, this.item._id, body);
                })
                .finally(() => {
                    resolve();
                })
            })
            
        },
    }
}
</script>