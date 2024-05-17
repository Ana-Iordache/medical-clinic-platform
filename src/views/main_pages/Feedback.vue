<template>
      <div id="feedback_container" class="page_container">
        <div class="text-h4 page_title"> Feedback </div>
        <div class="page_content_overlay">

        </div>
      </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '../../pinia_stores/authenticationStore';

export default {
    name: 'FeedbackPage',
    data: () => ({
        feedbackList: []
    }),
    async mounted() {
        if(this.currentUserConnected)
            await this.loadFeedback();
    },
    computed: {
        ...mapStores(useAuthenticationStore),
        currentUserConnected() {
            return this.authenticationStore.user;
        },
    },
    watch: {
        async currentUserConnected(newUser) {
            if(newUser) {
                await this.loadFeedback();
            }
        }
    },
    methods: {
        loadFeedback() {
            return new Promise(resolve => {
                this.axios.get(`/users/${this.currentUserConnected.email}/feedback`)
                .then(response => this.feedbackList = response.data)
                .catch(error => console.error(error))
                .finally(() => resolve());
            })
        }
    }
}
</script>

<style scoped>
#feedback_container {
    background: url('../../assets/feedback.jpg') no-repeat;
    background-size: cover;
    height: 100vh;
}
</style>