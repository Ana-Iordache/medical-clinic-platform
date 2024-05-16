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

        <div class="d-flex justify-center align-center text-button" :class="getColorClass(item.status)">
            <div> {{ item.status }} </div>
            <v-icon>{{ getIconStatus(item.status) }}</v-icon>
        </div>

        <!-- TODO: Prescription and Feedback -->
        <div v-if="userRole == 'patient' && !isInFuture" class="d-flex flex-row justify-space-around flex-grow-1 flex-wrap">
            <v-btn :variant="hasPrescription ? 'tonal' : 'outlined'" 
                color="#4091BE" 
                append-icon="mdi mdi-download" 
                @click="downloadPrescription(item.prescriptionUrl)" 
                title="Download prescription"
                :disabled="!hasPrescription"
                class="flex-grow-1 ma-2">
                Prescription
            </v-btn>
            <v-btn :disabled="isCanceled" 
                :variant="isCanceled ? 'outlined' : 'tonal'" 
                color="#4091BE" 
                append-icon="mdi mdi-star" 
                @click="openFeedbackDialog(true)" 
                title="Give feedback"
                class="flex-grow-1 ma-2">
                Feedback
            </v-btn>
        </div>

        <div v-if="userRole == 'doctor' && !isInFuture" class="d-flex justify-center">
            <v-btn variant="tonal" color="#4091BE" 
                :append-icon="hasPrescription ? 'mdi mdi-download' : 'mdi mdi-upload'" 
                @click="hasPrescription ? downloadPrescription(item.prescriptionUrl) : triggerFileInput()">
                Prescription
            </v-btn>
            <input type="file" accept=".pdf" @change="handleFileUpload" ref="upload_file_input" hidden>
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
                :readonly="hasFeedback"
            ></v-rating>

            <v-textarea
                v-model="feedback.review"
                variant="solo"
                maxlength="300"
                placeholder="Write your review here..."
                counter
                :rules="[rules.requiredField]"
                ref="textarea_review"
                :readonly="hasFeedback">
            </v-textarea>

            <v-card-actions class="align-self-center">
                <v-btn v-if="!hasFeedback" variant="tonal" @click="sendFeedback">Send</v-btn>
                <v-btn variant="tonal" @click="openFeedbackDialog(false)"> {{ !hasFeedback ? 'Cancel' : 'Close' }} </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-dialog v-model="showLoadingDialog" max-width="320" persistent>
        <Loading :title="'Uploading prescription'"></Loading>
    </v-dialog>
</template>

<script>
import generalMixin from '@/commons/mixins';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Loading from '@/components/Loading.vue';

export default {
    name: "AppointmentCard",
    mixins: [generalMixin],
    emits: ["appointment-updated"],
    components: {
        Loading
    },
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
        },
        showLoadingDialog: false
    }),
    computed: {
        cardTitle() {
            return this.userRole == 'patient' ? this.item.specialization : this.item.patientFullName;
        },
        isCanceled() {
            return this.item.status == 'canceled';
        },
        hasFeedback() {
            return  Object.prototype.hasOwnProperty.call(this.item, 'feedback');
        },
        hasPrescription() {
            return this.item.prescriptionUrl;
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

        // TODO: it doesn't download it, it opens in a tab
        downloadPrescription(url) {
            const downloadLink = document.createElement('a');
            downloadLink.href = url;
            downloadLink.setAttribute('download', '');
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        },

        // cors policy
        // getPrescriptionFile(url) {
        //     return new Promise(resolve => {
        //         this.axios.get(url)
        //         .then((response) => resolve(response.data))
        //         .catch(() => resolve(""));
        //     })
        // },

        triggerFileInput() {
            this.$refs.upload_file_input.click();
        },
        async handleFileUpload(e) {
            const file = e.target.files[0];
            if(file) {
                await this.uploadPrescription(file);
            }
        },
        uploadPrescription(file) {
            const storage = getStorage();

            let fileRef = storageRef(storage, 'patients-prescriptions/' + file.name);
            let uploadTask = uploadBytesResumable(fileRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        this.showLoadingDialog = progress != 100;
                    },
                    (error) => {
                        console.error(error);
                        reject(error);
                    },
                    async () => {
                        // Handle successful uploads on complete
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            await this.updateAppointment({ field: "prescriptionUrl", value: downloadURL })
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            })
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