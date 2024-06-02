<template>
    <div id="doctor_info_container" class="page_container">
        <div class="text-h4 page_title"> {{ doctorFullName }} </div>
        <div class="page_content_overlay">
            <v-btn class="ma-3" prepend-icon="mdi mdi-chevron-left" @click="goBackToDoctorsList()">
                Back to doctors
            </v-btn>

            <v-divider color="white" class="border-opacity-50 ma-2"></v-divider>
            
            <!-- <div> -->
            <v-card class="mx-3 mt-5">
                <div class="user_info_card">
                    <div class="profile_photo_section user_info_card_section">
                        <v-avatar :image="profilePhoto" size="300"></v-avatar>
                        <div class="text-subtitle-2 additional_info">
                            <div> {{ userInfo.professionalDegree }} </div>
                            <div> {{ userInfo.specialization }} </div>
                        </div>
                    </div>
                    <!-- TODO: maybe split these sections in separate custom components -->
                    <!-- TODO: check the cases when no schedule or review is found -->
                    <div class="info_section user_info_card_section">
                        <!-- Schedule SECTION -->
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

                        <!-- Reviews SECTION -->
                        <div class="text-subtitle-2 text-center"> Reviews </div>
                        <div class="d-flex flex-row text-center ">
                            <div class="d-flex flex-column text-center ratings_subsection">
                                <div class="font-weight-bold"> {{ reviews.averageRating }} / 5</div>
                                <div>({{ reviews.totalRatings }} ratings)</div>
                                <v-rating
                                    :model-value="reviews.averageRating"
                                    half-increments
                                    readonly
                                    color="#4091BE"
                                ></v-rating>
                                <div class="font-weight-thin">
                                    This is an average that reflects the scores given by patients following the interaction with the doctor during the consultation.
                                </div>
                            </div>
                            <!-- <v-divider vertical></v-divider> -->
                            <div class="d-flex flex-column text-center flex-grow-1">
                                <v-list
                                bg-color="transparent"
                                class="d-flex flex-column-reverse"
                                density="compact"
                                >
                                    <v-list-item v-for="(total, rating) in reviews.ratings" :key="rating">
                                        <v-progress-linear
                                            :model-value="total * 5"
                                            color="#4091BE"
                                            height="20"
                                            rounded
                                        ></v-progress-linear>

                                        <template v-slot:prepend>
                                            <span>{{ rating }}</span>
                                            <v-icon class="mx-2" icon="mdi-star"></v-icon>
                                        </template>

                                        <template v-slot:append>
                                            <div class="rating-values">
                                                <span class="d-flex justify-end mx-2"> {{ total }} </span>
                                            </div>
                                        </template>
                                    </v-list-item>
                                </v-list>
                                <div class="font-weight-thin font-italic">
                                    <b>Note:</b> Ratings with decimal points (like 4.5) are rounded down to the nearest whole number (4) for consistency in our calculations.
                                </div>
                            </div>
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
    name: 'DoctorInfo',
    mixins: [generalMixin],
    data: () => ({
        userInfo: {},
        reviews: {},
    }),

    async mounted() {
        const userId = this.$route.params.id;
        await this.loadUserInfo(userId);
        await this.loadRatings(this.userInfo.email);
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
        loadRatings(doctorEmail) {
            return new Promise(resolve => {
                this.axios.get(`/users/${doctorEmail}/feedback/ratings`)
                .then(response => this.reviews = response.data)
                .catch(error => console.error(error))
                .finally(() => resolve());
            })
        }
    }
}
</script>

<style scoped>
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

.ratings_subsection {
    flex-basis: 1rem;
}
</style>