<template>
      <div id="feedback_container" class="page_container">
        <div class="text-h4 page_title"> Feedback </div>
        <div class="page_content_overlay">
            <v-expansion-panels class="pa-5">
                <v-expansion-panel v-for="feedbackOfPatient in feedbackList" :key="feedbackOfPatient.patientEmail">
                    <v-expansion-panel-title>{{ feedbackOfPatient.patientFullName }}</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <div class="d-flex flex-row flex-wrap">
                            <FeedbackCard v-for="(feedbackItem, index) in feedbackOfPatient.feedback" 
                                :key="index"
                                :feedback="feedbackItem">
                            </FeedbackCard>
                        </div>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
      </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '../../pinia_stores/authenticationStore';
import FeedbackCard from '@/components/FeedbackCard.vue';

export default {
    name: 'FeedbackPage',
    components: {
        FeedbackCard,
    },
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