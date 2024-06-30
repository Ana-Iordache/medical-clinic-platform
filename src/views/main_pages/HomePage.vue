<template>
    <div class="page_container">
        <div v-if="authenticationStore.user" class="text-h4 page_title">
            Hello, {{ currentUserFullName }} 👋🏼
        </div>
        <div class="page_content_overlay">
            <div class="pa-4">
                <v-card>
                    <v-card-title>Your next appointment:</v-card-title>
                    <v-card-text> {{ nextAppointment }} </v-card-text>
                    <v-card-actions class="d-flex justify-end">
                        <v-btn 
                            append-icon="mdi-calendar-search"
                            variant="outlined"
                            color="#4091BE"
                            @click="redirectToAppointments()"
                        >See all future appointments</v-btn>
                    </v-card-actions>
                </v-card>
            </div>
            <div class="d-flex flex-row h-50 pt-4">
                <div class="chart_area">
                    <NumericalDataBarChart
                        :title="'Top 5 appreciated doctors'"
                        :data="dashboardData.topAppreciatedDoctors"
                        :labelTitle="'Rating'"
                        :typeOfData="'rating'">
                    </NumericalDataBarChart>
                </div>

                <div class="chart_area">
                    <NumericalDataBarChart
                        :title="'Top 5 most visited doctors'"
                        :data="dashboardData.topVisitedDoctors"
                        :labelTitle="'Visits'"
                        :typeOfData="'totalVisits'">
                    </NumericalDataBarChart>
                </div>
            </div>
            <div class="d-flex flex-row h-50">
                <div class="chart_area">
                    <BasePieChart
                        :title="'Total appointments per status'"
                        :data="getPieChartData('totalAppointmentsPerStatus')"
                        :labels="getPieChartLabels('totalAppointmentsPerStatus')">
                    </BasePieChart>
                </div>
                <div class="chart_area">
                    <BasePieChart
                        :title="'Total payments per status'"
                        :data="getPieChartData('totalPaymentsPerStatus')"
                        :labels="getPieChartLabels('totalPaymentsPerStatus')">
                    </BasePieChart>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '../../pinia_stores/authenticationStore';
import NumericalDataBarChart from '@/components/charts/NumericalDataBarChart.vue'
import BasePieChart from '@/components/charts/BasePieChart.vue'
import generalMixin from '@/commons/mixins';

export default {
    name: 'HomePage',
    components: {
        NumericalDataBarChart,
        BasePieChart
    },
    mixins: [generalMixin],

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
        },
        nextAppointment() {
            if(!this.dashboardData.nextAppointment) 
                return "None";
            const dateAndTime = this.dashboardData.nextAppointment.dateAndTime;
            return `${this.getDateStringFromDate(this.parseDateAndTimeString(dateAndTime))}  ${this.formatTimeFromDate(this.parseDateAndTimeString(dateAndTime), true)} (${this.dashboardData.nextAppointment.specialization})`;
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
        },
        getPieChartData(property) {
            return this.dashboardData[property] ? this.dashboardData[property].map(item => item.total) : [];
        },
        getPieChartLabels(property) {
            return this.dashboardData[property] ? this.dashboardData[property].map(item => item.status) : [];
        },
        redirectToAppointments() {
            this.$router.push({ path: '/appointments' });
        }
    }
}
</script>

<style scoped>
.chart_area {
    flex-basis: 100%;
}
</style>

<!-- the most appreciated doctors; the most visited; number of payments per status; the next future appointment -->
<!-- number of appointments per status; the next future appointment; total number of appointments and patients -->