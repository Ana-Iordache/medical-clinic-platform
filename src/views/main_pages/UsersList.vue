<template>
    <div ref="users_list_container" id="users_list_container" :style="containerStyle" class="page_container">
        <div class="text-h4 page_title"> {{ pageTitle }} </div>
        <div class="page_content_overlay">
            <v-toolbar class="px-4" color="transparent">
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

            <v-divider color="white" class="border-opacity-50 ma-2"></v-divider>

            <v-data-iterator :items="usersList" :items-per-page="6" :search="search">
                <template v-slot:default="{ items }">
                    <v-container class="pa-2" fluid>
                        <v-row dense>
                            <v-col v-for="item in items" :key="item._id" cols="auto" md="4" title="Click to see details">
                               <UserCard :item="item.raw"></UserCard>
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
import UserCard from "@/components/UserCard.vue";
import generalMixin from "@/commons/mixins";

export default {
    name: 'UsersList',
    mixins: [generalMixin],
    components: {
        UserCard
    },

    data: () => ({
        usersList: [],
        search: "",
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
            if(this.$route.path == "/doctors")
                url += `?role=doctor`;
            else if(this.$route.path == "/patients")
                url += `?role=patient&doctorEmail=${this.authenticationStore.user.email}`;
            return url;
        }
    },

    async mounted() {
        await this.loadUsers();
    },

    watch: {
        async currentUserRole(newRole) {
            if(newRole) {
                await this.loadUsers();
            }
        }
    },

    methods: {
        loadUsers() {
            const url = this.getUsersUrl;
            return new Promise(resolve => {
                this.axios.get(url)
                    .then(response => response.data)
                    .then(data => {
                        this.usersList = data.map(user => ({
                            ...user,
                            phoneNumber: user.phoneNumber ? user.phoneNumber.toString().substring(1) : null,
                            lastAppointment: user.lastAppointment ? this.getDateStringFromDate(this.parseDateAndTimeString(user.lastAppointment)) : null
                        }))
                    })
                    .catch(error => console.error(error))
                    .finally(() => resolve());
            })
        },
    }
}
</script>