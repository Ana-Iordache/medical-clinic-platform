<template>
    <div id="user_profile_container" class="page_container">
        <div class="text-h4 page_title">Manage your account</div>
        <div class="page_content_overlay">
            <DoctorProfileForm v-if="currentUserData.role == 'doctor'" :userData="currentUserData"/>
            <PatientProfileForm v-else-if="currentUserData.role == 'patient'" :userData="currentUserData"/>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '@/pinia_stores/authenticationStore';
import DoctorProfileForm from '@/components/DoctorProfileForm.vue';
import PatientProfileForm from '@/components/PatientProfileForm.vue';

export default {
    name: 'ProfilePage',
    components: {
        DoctorProfileForm,
        PatientProfileForm
    },
    data: () => ({
        currentUserData: {},
    }),
    async mounted() {
        if(this.authenticationStore.user)
            this.currentUserData = this.authenticationStore.user;
    },
    computed: {
        ...mapStores(useAuthenticationStore)
    },
    watch: {
        async 'authenticationStore.user'(newValue) {
            if(newValue)
                this.currentUserData = newValue;
        }
    },

}
</script>

<style scoped>
#user_profile_container {
    background: url('../../assets/profile_page.jpg') no-repeat;
    background-size: cover;
    height: 100vh;
}
</style>