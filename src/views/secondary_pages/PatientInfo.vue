<template>
    <div id="patient_info_container" class="page_container">
        <div class="text-h4 page_title"> {{ patientFullName }} </div>
        <div class="page_content_overlay">
            <v-btn class="ma-3" prepend-icon="mdi mdi-chevron-left" @click="goBackToPatientsList()">
                Back to patients
            </v-btn>

            <v-divider color="white" class="border-opacity-50 ma-2"></v-divider>
            
            <!-- <div> -->
            <v-card class="mx-3 mt-5">
                <div class="user_info_card">
                    <div class="profile_photo_section user_info_card_section">
                        <v-avatar :image="profilePhoto" size="300"></v-avatar>
                        <div class="text-subtitle-2 additional_info">
                            <div> Active user: {{ userInfo.activeAccount ? 'Yes' : 'No' }} </div>
                        </div>
                    </div>
                    <div class="info_section user_info_card_section">
                        <div class="d-flex flex-row justify-space-between flex-grow-1">
                            <v-list>
                                <v-list-item v-for="(info, index) in firstHalfInfo" 
                                    :key="index" 
                                    :title="info.title" 
                                    :subtitle="getValueIfNotEmpty(userInfo[info.key])">
                                </v-list-item>
                            </v-list>

                            <!-- TODO: it is not displayed -->
                            <!-- <v-divider vertical color="black" class="border-opacity-50 ma-2 flex-1-1"></v-divider> -->

                            <v-list>
                                <v-list-item v-for="(info, index) in secondHalfInfo" 
                                    :key="index" 
                                    :title="info.title" 
                                    :subtitle="getValueIfNotEmpty(userInfo[info.key])">
                                </v-list-item>
                            </v-list>
                        </div>

                        <!-- TODO: identity and health card -->
                        <div class="d-flex flex-row justify-space-around flex-grow-1">
                            <v-btn variant="tonal" color="#4091BE" append-icon="mdi mdi-download" @click="downloadCard('health')">
                                Health card
                            </v-btn>
                            <v-btn variant="tonal" color="#4091BE" append-icon="mdi mdi-download" @click="downloadCard('identity')">
                                Identity card
                            </v-btn>
                        </div>
                    </div>
                </div>
            </v-card>
        <!-- </div> -->
        </div>
    </div>
</template>

<script>
import generalMixin from "@/commons/mixins";
export default {
    name: 'PatientInfo',
    mixins: [generalMixin],
    data: () => ({
        userInfo: {},
        userInfoToDisplay: [
            { title: "Gender",                key: "gender" },
            { title: "Age",                   key: "age" },
            { title: "Identity number (CNP)", key: "identityNumber" },
            { title: "Phone number",          key: "phoneNumber" },
            { title: "Address",               key: "address" },
            { title: "Date of birth",         key: "birthDate" },
            { title: "Blood type",            key: "bloodType" },
            { title: "Height (m)",            key: "height" },
            { title: "Weight (kg)",           key: "weight" },
            { title: "Email",                 key: "email" }
        ]
    }),

    async mounted() {
        const userId = this.$route.params.id;
        await this.loadUserInfo(userId);
    },

    computed: {
        patientFullName() {
            return `${this.userInfo.firstName} ${this.userInfo.lastName}`;
        },
        profilePhoto() {
            return this.userInfo.profilePhotoUrl ? this.userInfo.profilePhotoUrl : require('@/assets/user_profile.jpg')
        },
        firstHalfInfo() {
            const halfLength = Math.ceil(this.userInfoToDisplay.length / 2);
            return this.userInfoToDisplay.slice(0, halfLength);
        },
        secondHalfInfo() {
            const halfLength = Math.ceil(this.userInfoToDisplay.length / 2);
            return this.userInfoToDisplay.slice(halfLength + 1, this.userInfoToDisplay.length);
        }
    },

    methods: {
        goBackToPatientsList() {
            this.$router.push({ path: '/patients' })
        },
        loadUserInfo(userId) {
            return new Promise(resolve => {
                this.axios.get(`/users/${userId}?property=_id`)
                .then(response => this.userInfo = response.data)
                .catch(error => console.error(error))
                .finally(() => resolve());
            })
        },
        downloadCard(type) {
            console.log(`TODO download ${type} card`)
        }
    }
}
</script>

<style>
#patient_info_container {
    background: url('../../assets/patients_list.jpg') no-repeat;
    background-size: cover;
    height: 100vh;
}

.additional_info {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid #c6c6c6;
  padding: 1rem;
}

.info_section ul {
    list-style: none;
}
</style>