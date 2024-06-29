<template>
    <div class="page_container">
        <div v-if="authenticationStore.user" class="text-h4 page_title">
            Hello, {{ currentUserFullName }} 👋🏼
        </div>
        <div class="page_content_overlay">
            <div class="d-flex flex-row h-100">
                <div class="bar_chart">
                    <NumericalDataBarChart
                        :title="'Top 5 appreciated doctors'"
                        :data="dashboardData.topAppreciatedDoctors"
                        :labelTitle="'Rating'"
                        :typeOfData="'rating'">
                    </NumericalDataBarChart>
                </div>

                <div class="bar_chart">
                    <NumericalDataBarChart
                        :title="'Top 5 most visited doctors'"
                        :data="dashboardData.topVisitedDoctors"
                        :labelTitle="'Visits'"
                        :typeOfData="'totalVisits'">
                    </NumericalDataBarChart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '../../pinia_stores/authenticationStore';
import NumericalDataBarChart from '@/components/charts/NumericalDataBarChart.vue'

export default {
    name: 'HomePage',
    components: {
        NumericalDataBarChart
    },

    data: () => ({
        dashboardData: {}
    }),

    async mounted() {
        if(this.authenticationStore.user)
            await this.loadDashboardData();
    },
    
    computed: {
        ...mapStores(useAuthenticationStore),
        currentUserFullName() {
            return `${this.authenticationStore.user.firstName} ${this.authenticationStore.user.lastName}`;
        }
    },
    watch: {
        async 'authenticationStore.user'(newValue) {
            if(newValue) {
                await this.loadDashboardData();
            }
        }
    },
    methods: {
        loadDashboardData() {
            return new Promise(resolve => {
                this.axios.get(`/users/${this.authenticationStore.user.email}/homedashboard`)
                .then(response => this.dashboardData = response.data)
                .catch(error => console.error(error))
                .finally(() => resolve());
            })
        }
    }
}
</script>

<style scoped>
.bar_chart {
    flex-basis: 100%;
}
</style>

<!-- the most appreciated doctors; the most visited; number of payments per status; the next future appointment -->
<!-- number of appointments per status; the next future appointment; total number of appointments and patients -->