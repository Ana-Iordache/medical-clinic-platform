<template>
    <div id="doctor_info_container" class="page_container">
        <div class="text-h4 page_title"> {{ doctorFullName }} </div>
        <div class="page_content_overlay">
            <v-btn class="ma-3" prepend-icon="mdi mdi-chevron-left" @click="goBackToDoctorsList()">
                Back to doctors
            </v-btn>

            <v-divider color="white" class="border-opacity-50 ma-2"></v-divider>
            
            <div>
            <v-card class="mx-3 mt-5">
                <div class="user_info_card">
                    <div class="profile_photo_section user_info_card_section">
                        <v-avatar :image="profilePhoto" size="300"></v-avatar>
                        <div class="text-subtitle-2 additional_info">
                            <div> {{ userInfo.professionalDegree }} </div>
                            <div> {{ userInfo.specialization }} </div>
                        </div>
                    </div>
                    <div class="info_section user_info_card_section">
                        <div class="text-subtitle-2 text-center"> Schedule </div>
                        <div class="d-flex flex-row text-center justify-center">
                            <ul class="me-2">
                                <li v-for="(day, index) in userInfo.schedule" :key="index"> 
                                    {{ getStringDayOfWeek(day.dayOfWeek) }} 
                                </li>
                            </ul>
                            <ul class="ms-2">
                                <li v-for="(day, index) in userInfo.schedule" :key="index"> 
                                    {{ day.startHour }} - {{ day.endHour }}
                                </li>
                            </ul>
                        </div>

                        <v-divider class="my-2"></v-divider>

                        <!-- TODO: get reviews in BE -->
                        <div class="text-subtitle-2 text-center"> Reviews </div>
                    </div>
                
                </div>
            </v-card>
        </div>
        </div>
    </div>
</template>

<script>
import generalMixin from "@/commons/mixins";
export default {
    name: 'DoctorInfo',
    mixins: [generalMixin],
    data: () => ({
        userInfo: {}
    }),

    async mounted() {
        const userId = this.$route.params.id;
        await this.loadUserInfo(userId);
    },

    computed: {
        doctorFullName() {
            return `Dr. ${this.userInfo.firstName} ${this.userInfo.lastName}`;
        },
        profilePhoto() {
            return this.userInfo.profilePhotoUrl ? this.userInfo.profilePhotoUrl : require('@/assets/user_profile.jpg')
        }
    },

    methods: {
        goBackToDoctorsList() {
            this.$router.push({ path: '/doctors' })
        },
        loadUserInfo(userId) {
            return new Promise(resolve => {
                this.axios.get(`/users/${userId}?property=_id`)
                .then(response => this.userInfo = response.data)
                .catch(error => console.error(error))
                .finally(() => resolve());
            })
        },
    }
}
</script>

<style>
#doctor_info_container {
    background: url('../../assets/doctors_list.jpg') no-repeat;
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