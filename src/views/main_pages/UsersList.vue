<template>
    <div ref="users_list_container" id="users_list_container" :style="containerStyle" class="page_container">
        <div class="text-h4 page_title"> {{ pageTitle }} </div>
        <div class="page_content_overlay">

        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '../../pinia_stores/authenticationStore';

export default {
    name: 'UsersList',

    data: () => ({
        usersList: []
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
                backgroundSize: 'cover'
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
       await this.loadUsers();
    },

    methods: {
        loadUsers() {
            const url = this.getUsersUrl;
            return new Promise(resolve => {
                this.axios.get(url)
                    .then(response => response.data)
                    .then(data => this.usersList = data)
                    .catch(error => console.error(error))
                    .finally(() => resolve());
            })
        }
    }
}
</script>

<style scoped>
</style>