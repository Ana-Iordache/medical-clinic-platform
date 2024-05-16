<template>
    <v-card prepend-icon="mdi-calendar" title="Add new appointment">
        <!-- TODO: split the steps into separate components -->
        <v-stepper v-model="currentStepNo" :items="steps" show-actions>
            <template v-slot:[`item.1`]>
                <div class="text-subtitle-2 mb-2">Choose specialization and doctor</div>
                <v-row>
                    <v-col>
                        <v-autocomplete v-model="specializationSelected" 
                            variant="solo" 
                            label="Specialization" 
                            :items="specializations"
                            density="comfortable"
                            class="ps-2"
                        ></v-autocomplete>
                    </v-col>
                    <v-col>
                        <v-autocomplete v-model="doctorSelected" 
                            variant="solo" 
                            label="Doctor" 
                            :items="doctorsFiltered"
                            item-title="fullName"
                            item-value="_id"
                            density="comfortable"
                            class="pe-2"
                        ></v-autocomplete>
                    </v-col>
                </v-row>
            </template>
            <template v-slot:[`item.2`]>
                <div class="text-subtitle-2 mb-2">Choose date and time</div>
                <div v-if="!specializationSelected || !doctorSelected"> Please select a doctor first. </div>
                <div v-else class="first_section">
                    <!-- TODO: style this schedule section -->
                    <div class="schedule_subsection">
                        <div>Schedule of {{ doctorSelected }}:</div>
                        <div class="d-flex flex-row flex-grow-1">
                            <ul class="me-2">
                                <li v-for="(day, index) in doctorSelectedInfo.schedule" :key="index"> 
                                    {{ getStringDayOfWeek(day.dayOfWeek) }} 
                                </li>
                            </ul>
                            <ul class="ms-2">
                                <li v-for="(day, index) in doctorSelectedInfo.schedule" :key="index"> 
                                    {{ day.startHour }} - {{ day.endHour }}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="selection_subsection mx-2">
                        <v-row>
                            <v-col>
                                <v-date-input v-model="dateSelected"
                                    label="Choose date" 
                                    variant="solo" 
                                    width="100%" 
                                    prepend-inner-icon="mdi-calendar" 
                                    prepend-icon=""
                                    density="comfortable"
                                ></v-date-input>
                            </v-col>
                            <v-col>
                                <v-autocomplete v-model="investigationSelected"
                                    variant="solo" 
                                    label="Choose investigation" 
                                    :items="investigations"
                                    item-title="name"
                                    density="comfortable"
                                    class="ps-2"
                                ></v-autocomplete>
                            </v-col>
                        </v-row>

                        <div> Available hours: </div>
                        <v-divider color="#c6c6c6" class="border-opacity-50 my-2"></v-divider>

                        <v-row>
                            <v-col v-if="selectedOutOfScheduleDate">
                                Doctor doesn't have work hours on {{  getStringDayOfWeek(dateSelected.getDay()) }}s.
                            </v-col>
                            <v-col v-else-if="!dateSelected">
                                Please select a date.
                            </v-col>
                            <v-col v-else-if="availableHours.length == 0">
                                No available hours.
                            </v-col>
                            <v-col v-else>
                                <v-chip v-for="(hour, index) in availableHours" :key="index" 
                                    class="ma-2 pointer_on_hover" 
                                    title="Click to select" 
                                    color="#4091BE"
                                    :variant="timeSelected == hour ? 'elevated' : 'outlined'"
                                    @click="selectTime(hour)">
                                    {{ hour }}
                                </v-chip>
                            </v-col>
                        </v-row>
                    </div>
                </div>
            </template>
            <template v-slot:[`item.3`]>
                <div class="text-subtitle-2 mb-2">Confirm your appointment</div>
                <div v-if="!dateSelected || !timeSelected || !investigationSelected"> 
                    Please select the date, time and an investigation first. 
                </div>
                <div v-else class="d-flex">
                    <v-list class="appointment_details_area">
                        <v-list-item v-for="(detail, index) in appointmentDetails" :key="index"
                            :title="detail.title" :subtitle="detail.value"></v-list-item>
                    </v-list>
                    <div class="buttons_area">
                        <!-- TODO: confirm and pay appointment buttons -->
                        <v-btn variant="tonal" color="#4091BE" @click="confirmAppointment()">
                            Confirm
                        </v-btn>
                        <v-btn variant="tonal" color="#4091BE" @click="confirmAndPayAppointment()">
                            Confirm and pay {{ amountToPay }}
                        </v-btn>
                        <v-btn variant="tonal" @click="cancel()">
                            Cancel
                        </v-btn>
                    </div>
                </div>
            </template>
        </v-stepper>
    </v-card>
</template>

<script>
import generalMixin from "@/commons/mixins";
import { VDateInput } from 'vuetify/labs/VDateInput'

export default {
    name: "AddNewAppointmentCard",
    mixins: [generalMixin],
    emits: ["appointment-creation-canceled", "appointment-added"],
    components: {
        VDateInput
    },
    props: {
        patientEmail: {
            type: String,
            required: true
        }
    },
    data: () => ({
        currentStepNo: 1,
        steps: ["Specialization", "Date and time", "Confirmation"],

        servicesList: [],
        specializationSelected: null,

        doctorsList: [],
        doctorSelected: null,
        doctorSelectedInfo: {},

        investigationSelected: null,
        dateSelected: null,

        availableHours: [],
        selectedOutOfScheduleDate: false,
        timeSelected: null
    }),
    async mounted() {
        await this.loadServices();
        await this.loadDoctors();
    },
    computed: {
        specializations() {
            const specializations = this.servicesList.map(service => service.name);
            return specializations;
        },
        doctorsFiltered() {
            return this.specializationSelected ? this.doctorsList.filter(doctor => doctor.specialization == this.specializationSelected) : this.doctorsList;
        },
        investigations() {
            let specializationSelected = this.servicesList.find(service => service.name == this.specializationSelected);
            return specializationSelected.investigations;
        },
        amountToPay() {
            let investigation = this.investigations.find(investigation => investigation.name == this.investigationSelected);
            return investigation.price;
        },
        appointmentDetails() {
            let details = [
                { title: "Specialization", value: this.specializationSelected },
                { title: "Investigation",  value: this.investigationSelected },
                { title: "Doctor",         value: this.doctorSelected },
                { title: "Date and time",  value: `${this.getDateStringFromDate(this.dateSelected)} ${this.timeSelected}` },
                { title: "Amount to pay",  value: `${this.amountToPay} RON` },
            ]
            return details;
        }
    },
    methods: {
        loadServices() {
            return new Promise(resolve => {
                this.axios.get('/services')
                    .then(response => this.servicesList = response.data)
                    .catch(error => console.error(error))
                    .finally(() => resolve());
            })
        },
        loadDoctors() {
            return new Promise(resolve => {
                this.axios.get('/users?role=doctor')
                    .then(response => {
                        this.doctorsList = response.data.map(doctor => ({
                            id: doctor._id,
                            specialization: doctor.specialization,
                            fullName: `${doctor.firstName} ${doctor.lastName}`
                        }))
                    })
                    .catch(error => console.error(error))
                    .finally(() => resolve());
            })
        },
        getDoctorInfo(id) {
            return new Promise(resolve => {
                this.axios.get(`/users/${id}?property=_id`)
                .then(response => resolve(response.data))
                .catch(() => resolve({}));
            })
        },
        /**
         * Parse a date to format 'mm/dd/yyyy' as a string.
         * @param {Date} dateValue 
         */
        getStringFormatOfDate(dateValue) {
            const date = new Date(dateValue);
            let month = date.getMonth() + 1;
            let day = date.getDate();
            const year = date.getFullYear();

            month = month.toString().length == 1 ? `0${month}` : month;
            day = day.toString().length == 1 ? `0${day}` : day;

            const stringFormat = `${month}/${day}/${year}`;
            return stringFormat;
        },
        getAppointmentsOfDoctorByDate(date) {
            return new Promise(resolve => {
                this.axios.get(`/users/${this.doctorSelectedInfo.email}/appointments?role=doctor&date=${date}`)
                .then(response => resolve(response.data))
                .catch(() => resolve([]));
            })
        },
        setAvailableHours(busyHours) {
            const dateSelected = new Date(this.dateSelected);
            const daySelected = dateSelected.getDay();
            const scheduleOfDaySelected = this.doctorSelectedInfo.schedule.find(day => day.dayOfWeek == daySelected);
            if(scheduleOfDaySelected) {
                this.selectedOutOfScheduleDate = false;
                this.availableHours = this.generateHoursArray(scheduleOfDaySelected.startHour, scheduleOfDaySelected.endHour, busyHours);
            } else {
                this.selectedOutOfScheduleDate = true;
                this.availableHours = [];
            }
        },
        generateHoursArray(startHour, endHour, busyHours) {
            const startTime = this.parseTimeToDate(startHour);
            const endTime = this.parseTimeToDate(endHour);

            let currentTime = new Date(startTime);
            const hoursArray = [];

            while (currentTime < endTime) {
                const formattedTime = this.formatTimeFromDate(currentTime, false);

                // add the hour only if is not already taken by another appointment which is not canceled
                if(!busyHours.includes(formattedTime))
                    hoursArray.push(formattedTime);

                // Add 20 minutes to the current time
                currentTime.setMinutes(currentTime.getMinutes() + 20);
                currentTime.setSeconds(0);
            }

            return hoursArray;
        },
        selectTime(time) {
            this.timeSelected = time;
        },
        async confirmAppointment() {
            const appointment = {
                doctorEmail: this.doctorSelectedInfo.email,
                date: this.getStringFormatOfDate(this.dateSelected),
                time: this.timeSelected,
                amount: this.amountToPay
            }
            
            await this.addAppointment(appointment);
        },
        confirmAndPayAppointment() {

        },
        cancel() {
            this.$emit("appointment-creation-canceled");
        },
        addAppointment(appointment) {
            return new Promise(resolve => {
                this.axios.post(`/users/${this.patientEmail}/appointments`, appointment)
                    .then(response => {
                        this.$emit("appointment-added", true, response.data.message)
                    })
                    .catch(error => {
                        this.$emit("appointment-added", false, error.response.data.message)
                    })
                    .finally(() => resolve())
            })
        }
    },
    watch: {
        specializationSelected(newValue, oldValue) {
            if(newValue && oldValue && this.doctorSelected)
                this.doctorSelected = null;
        },
        async doctorSelected(newValue) {
            if(newValue) {
                let doctor = this.doctorsFiltered.find(doctor => doctor.fullName == newValue);
                this.specializationSelected = doctor.specialization;
                this.doctorSelectedInfo = await this.getDoctorInfo(doctor.id);
            }
        },
        async dateSelected(newValue) {
            this.timeSelected = null;
            if(newValue) {
                const stringDate = this.getStringFormatOfDate(newValue);
                let appointmentsOfTheDay = await this.getAppointmentsOfDoctorByDate(stringDate);
                let busyHours = appointmentsOfTheDay.map(item => item.hour);
                this.setAvailableHours(busyHours);
            }
        }
    }
}
</script>

<style scoped>
ul {
    list-style: none;
}

.first_section {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.first_section .selection_subsection {
    flex-grow: 1;
}

.schedule_subsection {
    text-wrap: nowrap;
}

.buttons_area {
    display: flex;
    flex-direction: column;
    justify-content: end;
    gap: 1rem;
}

.appointment_details_area {
    flex-basis: 100%;
}
</style>