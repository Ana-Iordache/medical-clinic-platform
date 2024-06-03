<template>
    <v-form ref="form" class="ma-5 d-flex flex-column" @submit.prevent="submitForm">
        <div class="one_line_inputs">
            <div class="column">
                <v-text-field
                    v-model="editedData.firstName"
                    :rules="[rules.requiredField]"
                    label="First name*"
                    type="text"
                    variant="solo" 
                    prepend-inner-icon="mdi mdi-account">
                </v-text-field>
    
                <v-text-field
                    v-model="editedData.lastName"
                    :rules="[rules.requiredField]"
                    label="Last name*"
                    type="text"
                    variant="solo" 
                    prepend-inner-icon="mdi mdi-account">
                </v-text-field>

                <v-select
                    v-model="editedData.professionalDegree"
                    :items="professionalDegrees"
                    variant="solo"
                    label="Professional degree*"
                    prepend-inner-icon="mdi-card-account-details">
                </v-select>
                <v-select
                    v-model="editedData.specialization"
                    :items="specializations"
                    variant="solo"
                    label="Specialization*"
                    prepend-inner-icon="mdi-medical-bag">
                </v-select>

                <v-text-field
                    v-model="editedData.phoneNumber"
                    label="Phone number*"
                    :rules="[rules.requiredField, rules.tenCharacters]"
                    type="text"
                    variant="solo" 
                    prepend-inner-icon="mdi mdi-phone"
                    @input="handleOnlyNumbersInput($event, 'phoneNumber')"
                ></v-text-field>
        
                <v-text-field
                    v-model="editedData.email"
                    :rules="[rules.requiredField]"
                    label="Email"
                    type="email"
                    variant="solo" 
                    prepend-inner-icon="mdi mdi-email">
                </v-text-field>
            </div>

            <v-card class="column">
                <v-avatar :image="profilePhoto" 
                    size="250" 
                    class="align-self-center pointer_on_hover mt-3"
                    @click="triggerFileInput()"
                    title="Click to change you profile picture"
                ></v-avatar>
                <input type="file" accept="image/*" @change="handleFileUpload" ref="upload_file_input" hidden>
                <v-list>
                    <div class="d-flex justify-space-between mx-3">
                        <div class="v-label">Schedule</div>
                        <v-icon icon="mdi-plus" title="Add new day" @click="openScheduleDialog(true, 'add')"></v-icon>
                    </div>
                    <!-- <v-list-subheader></v-list-subheader> -->
                    <v-list-item v-for="(day, index) in editedData.schedule"
                        :key="index"
                        :title="getStringDayOfWeek(day.dayOfWeek)"
                        :subtitle="getScheduleHoursOfDay(day)">
                        <template v-slot:append>
                            <v-icon title="Edit" icon="mdi-pencil" @click="editDayOfSchedule(day, index)" color="green-lighten-1" size="20"></v-icon>
                            <v-icon title="Remove" icon="mdi-delete" @click="removeDayFromSchedule(index)" color="red-lighten-1" size="20"></v-icon>
                        </template>
                    </v-list-item>
                </v-list>
            </v-card>
        </div>

        <div class="d-flex flex-column">
            <v-btn type="submit" color="#4091BE" class="my-2">Save changes</v-btn>
            <!-- TODO: change email and password -->
            <div class="one_line_inputs">
                <v-btn class="flex-grow-1">change email</v-btn>
                <v-btn class="flex-grow-1">change password</v-btn>
            </div>
        </div>
    </v-form>

    <v-dialog v-model="scheduleDialog.show" width="fit-content">
        <v-card class="pa-3">
            <v-select
                v-model="scheduleDialog.dayOfWeek"
                :items="filteredDayOfWeeks"
                variant="solo"
                label="Day of week"
                :disabled="scheduleDialog.mode == 'edit'">
            </v-select>
            <div class="d-flex flex-row align-center justify-space-evenly">
                <div>
                    <h2>Start:</h2>
                    <v-time-picker v-model="scheduleDialog.start" format="24hr"></v-time-picker>
                </div>
                <div>
                    <h2>End:</h2>
                    <v-time-picker v-model="scheduleDialog.end" format="24hr"></v-time-picker>
                </div>
            </div>
            <v-card-actions>
                <v-btn variant="tonal" 
                    color="#4091BE" 
                    @click="scheduleDialog.mode == 'add' ? addSchedule() : saveSchedule()" 
                    :disabled="hasNotChosenAllData">
                    {{ scheduleDialog.mode == 'add' ? 'Add' : 'Save' }}
                </v-btn>
                <v-btn variant="tonal" @click="openScheduleDialog(false)">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>

    <v-snackbar v-model="confirmation.show"
        :timeout="4000" 
        :color="confirmation.success ? 'green-lighten-1' : 'red-lighten-1'" 
        elevation="24">
        <v-icon>{{ confirmation.success ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}</v-icon>
        {{ confirmation.message }}
    </v-snackbar>
</template>

<script>
import generalMixin from "@/commons/mixins";
import { VTimePicker } from 'vuetify/labs/VTimePicker';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth, updateEmail } from '@firebase/auth';

export default {
    name: "DoctorProfileForm",
    props: {
        userData: {
            type: Object,
            required: true
        }
    },
    components: {
        VTimePicker,
    },
    mixins: [generalMixin],
    data: () => ({
        editedData: {},
        specializations: [],
        scheduleDialog: {
            end: null,
            start: null,
            dayOfWeek: null,
            show: false,
            mode: ""
        },
        confirmation: {
            show: false,
            success: true,
            message: ""
        }
    }),
    async mounted() {
        this.editedData = {
            email: this.userData.email,
            phoneNumber: this.userData.phoneNumber.toString().substring(1),
            schedule: this.userData.schedule,
            profilePhotoUrl: this.userData.profilePhotoUrl,
            specialization: this.userData.specialization,
            professionalDegree: this.userData.professionalDegree,
            firstName: this.userData.firstName,
            lastName: this.userData.lastName
        }
        this.specializations = await this.getSpecializations();
    },
    computed: {
        filteredDayOfWeeks() {
            const daysOfCurrentSchedule = this.editedData.schedule.map(schedule => schedule.dayOfWeek);
            return this.dayOfWeeks.filter(day => !daysOfCurrentSchedule.includes(this.dayOfWeeks.indexOf(day)));
        },
        hasNotChosenAllData() {
            return !this.scheduleDialog.start || !this.scheduleDialog.end || !this.scheduleDialog.dayOfWeek;
        },
        profilePhoto() {
            return this.editedData.profilePhotoUrl ? this.editedData.profilePhotoUrl : require('@/assets/user_profile.jpg')
        }
    },
    methods: {
        async submitForm() {
            let formValidation = await this.$refs.form.validate();
            if (formValidation.valid) {
                if(this.userData.email != this.editedData.email) {
                    await this.updateUserEmail(this.editedData.email);
                }

               await this.updateData();
            }
        },
        updateData() {
            return new Promise(resolve => {
                this.axios.put(`/users/${this.userData._id}?role=doctor`, { data: this.editedData })
                .then(response => {
                    this.confirmation = {
                        show: true,
                        success: true,
                        message: response.data.message
                    }
                })
                .catch(error => {
                    this.confirmation = {
                        show: true,
                        success: false,
                        message: error.response.data.message
                    }
                })
                .finally(() => resolve());
            })
        },
        // TODO: firebase doesn't let me change an email if it hasn't been verified
        async updateUserEmail(email) {
            updateEmail(getAuth().currentUser, email)
            .then(() =>{
                // console.log("email updated")
            })
            .catch(() => {
                // console.error("email couldn't be updated: ", error)
                this.editedData.email = this.userData.email;
            })
        },
        handleOnlyNumbersInput(event, inputName) {
            this.editedData[inputName] = this.onlyNumbersInput(event.target.value);
        },
        getScheduleHoursOfDay(day) {
            return `${day.startHour} - ${day.endHour}`
        },
        removeDayFromSchedule(index) {
            this.editedData.schedule.splice(index, 1);
        },
        openScheduleDialog(show, mode = '') {
            this.scheduleDialog.show = show;
            this.scheduleDialog.mode = mode;
            if(!show) {
                this.scheduleDialog = {
                    start: null,
                    end: null,
                    dayOfWeek: null
                }
            }
        },
        addSchedule() {
            const indexOfDay = this.dayOfWeeks.indexOf(this.scheduleDialog.dayOfWeek);
            const newSchedule = {
                startHour: this.scheduleDialog.start,
                endHour: this.scheduleDialog.end,
                dayOfWeek: indexOfDay
            }
            this.editedData.schedule = [
                ...this.editedData.schedule.slice(0, indexOfDay - 1),
                newSchedule,
                ...this.editedData.schedule.slice(indexOfDay - 1)
            ]

            this.openScheduleDialog(false);
        },
        editDayOfSchedule(day, index) {
            this.scheduleDialog = {
                start: day.startHour,
                end: day.endHour,
                dayOfWeek: this.getStringDayOfWeek(day.dayOfWeek),
                index: index
            }

            this.openScheduleDialog(true, "edit");
        },
        saveSchedule() {
            this.editedData.schedule[this.scheduleDialog.index].startHour = this.scheduleDialog.start;
            this.editedData.schedule[this.scheduleDialog.index].endHour = this.scheduleDialog.end;

            this.openScheduleDialog(false);
        },

        
        triggerFileInput() {
            this.$refs.upload_file_input.click();
        },
        async handleFileUpload(e) {
            const file = e.target.files[0];
            if(file) {
                await this.uploadProfilePhoto(file);
            }
        },
        uploadProfilePhoto(file) {
            const storage = getStorage();

            let fileRef = storageRef(storage, 'doctors-profile-pictures/' + file.name);
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
                            this.editedData.profilePhotoUrl = downloadURL;
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            })
        }
    }
}
</script>

<style scoped>
.column {
    display: flex;
    flex-direction: column;
    flex-basis: 50%;
}
</style>