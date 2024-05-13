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
        }
    },

    mounted() {
       
    }
}
</script>

<style scoped>
</style>