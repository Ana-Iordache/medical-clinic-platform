<template>
    <div ref="users_list_container" id="users_list_container" :style="containerStyle" class="page_container">
        <div class="text-h4 page_title"> {{ pageTitle }} </div>
        <div class="page_content_overlay">
            <v-data-iterator :items="usersList" :items-per-page="6" :search="search">
                <template v-slot:header>
                    <v-toolbar class="px-2" color="transparent">
                        <v-text-field
                            v-model="search"
                            density="comfortable"
                            placeholder="Search"
                            prepend-inner-icon="mdi-magnify"
                            style="max-width: 300px"
                            variant="solo"
                            clearable
                            hide-details
                        ></v-text-field>
                    </v-toolbar>
                </template>

                <template v-slot:default="{ items }">
                    <v-container class="pa-2" fluid>
                        <v-row dense>
                            <v-col v-for="item in items" :key="item._id" cols="auto" md="4">
                                <v-card class="pb-3" border flat>
                                    <div class="text-h6 text-center"> {{ item.raw.firstName }} {{ item.raw.lastName }}</div>

                                    <div class="user_info_area">
                                        <!-- TODO: check how it is displayed with an actual photo -->
                                        <v-avatar :image="getProfilePhotoUrl(item.raw)" size="100"></v-avatar>
                                        <v-list lines="one">
                                            <div v-if="item.raw.role == 'doctor'">
                                                <v-list-item
                                                    v-for="info in doctorUserInfo"
                                                    :key="info"
                                                    :title="info.title"
                                                    :subtitle="item.raw[info.key] ?? '-'"
                                                ></v-list-item>
                                            </div>

                                            <div v-else-if="item.raw.role == 'patient'">
                                                <v-list-item
                                                    v-for="info in patientUserInfo"
                                                    :key="info"
                                                    :title="info.title"
                                                    :subtitle="item.raw[info.key] ?? '-'"
                                                ></v-list-item>
                                            </div>
                                        </v-list>
                                    </div>

                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                </template>

                <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
                    <div class="d-flex align-center justify-center pa-4">
                    <v-btn
                        :disabled="page === 1"
                        density="comfortable"
                        icon="mdi-arrow-left"
                        variant="tonal"
                        rounded
                        @click="prevPage"
                    ></v-btn>

                    <div class="mx-2 text-caption">
                        Page {{ page }} of {{ pageCount }}
                    </div>

                    <v-btn
                        :disabled="page >= pageCount"
                        density="comfortable"
                        icon="mdi-arrow-right"
                        variant="tonal"
                        rounded
                        @click="nextPage"
                    ></v-btn>
                    </div>
                </template>
            </v-data-iterator>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '../../pinia_stores/authenticationStore';

export default {
    name: 'UsersList',

    data: () => ({
        usersList: [],
        search: "",
        doctorUserInfo: [
            { title: "Professional degree", key: "professionalDegree" },
            { title: "Specialization",      key: "specialization" },
            { title: "Phone",               key: "phoneNumber" }
        ],
        patientUserInfo: [
            { title: "CNP",              key: "identityNumber" },
            { title: "Last appointment", key: "lastAppointment" }, // TODO: get last appointment in BE
            { title: "Phone",            key: "phoneNumber" }
        ]
    }),

    computed: {
        ...mapStores(useAuthenticationStore),
        currentUserRole() {
            return this.authenticationStore.user ? this.authenticationStore.user.role : "";
        },
        pageTitle() {
            switch(this.currentUserRole) {
                case "doctor":
                    return "Your patients";
                case "patient":
                    return "Doctors";
                default:
                    return "";
            }
        },
        backgroundImageUrl() {
            switch(this.currentUserRole) {
                case "doctor":
                    return require('@/assets/patients_list.jpg');
                case "patient":
                default:
                    return require('@/assets/doctors_list.jpg');
            }
        },
        containerStyle() {
            return {
                backgroundImage: `url(${this.backgroundImageUrl})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                height: '100vh'
            }
        },
        getUsersUrl() {
            let url = `/users`;
            if(this.currentUserRole == "patient")
                url += `?role=doctor`;
            else if(this.currentUserRole == "doctor")
            // TODO: here should be also filtered by appointments (doctors should only see the patients that had at least one appointment with them)
                url += `?role=patient`;
            return url;
        }
    },

    async mounted() {
        // TODO: when page is refreshed, the pinia store is loaded after mounted. FIX THIS
       await this.loadUsers();
    },

    methods: {
        loadUsers() {
            const url = this.getUsersUrl;
            console.log("DEBUG currentUserRole: ", this.currentUserRole)
            console.log("DEBUG url: ", url)
            return new Promise(resolve => {
                this.axios.get(url)
                    .then(response => response.data)
                    .then(data => this.usersList = data)
                    .catch(error => console.error(error))
                    .finally(() => resolve());
            })
        },
        getProfilePhotoUrl(user) {
           return user.profilePhotoUrl ? user.profilePhotoUrl : require('@/assets/user_profile.jpg');
        }
    }
}
</script>

<style scoped>
.user_info_area {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
}
</style>