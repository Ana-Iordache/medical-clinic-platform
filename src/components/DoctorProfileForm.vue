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
</template>

<script>
import generalMixin from "@/commons/mixins";
import { VTimePicker } from 'vuetify/labs/VTimePicker'

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
        }
    },
    methods: {
        submitForm() {
            console.log("save")
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
        }
    }
}
</script>

<style scoped>
.column {
    flex-basis: 50%;
}
</style>