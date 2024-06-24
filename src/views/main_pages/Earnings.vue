<template>
    <div id="earnings_container" class="page_container">
        <div class="text-h4 page_title"> Earnings </div>
        <div class="page_content_overlay">
            <v-toolbar color="transparent" class="px-4">
                <v-select v-model="selectedYear" 
                    :items="[2022, 2023, 2024]"
                    variant="solo"
                    max-width="200px"
                    hide-details
                    density="comfortable"
                    label="Year"
                    >
                </v-select>
            </v-toolbar>
            <v-divider color="white" class="border-opacity-50 ma-2"></v-divider>
            <div class="pe-4 text-subtitle-2 d-flex justify-end">Total: {{ totalEarnings }} RON</div>
            <BarChart 
                :data="barchartData"
                :labels="months"
                :title="'Monthly earnings'"
            ></BarChart>
        </div>
    </div>
</template>

<script>
import generalMixin from "@/commons/mixins";
import BarChart from '@/components/BarChart.vue';
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '@/pinia_stores/authenticationStore';
export default {
    name: 'EarningsPage',
    mixins: [generalMixin],
    components: {
        BarChart
    },
    data: () => ({
        selectedYear: new Date().getFullYear(),
        earnings: [],
        barchartData: [],
        totalEarnings: 0
    }),
    async mounted() {
        await this.loadEarnings();
        await this.loadChartData(this.selectedYear);
    },
    computed: {
        ...mapStores(useAuthenticationStore)
    },
    watch: {
        selectedYear(newValue) {
            if(newValue)
                this.loadChartData(newValue);
        }
    },
    methods: {
        loadEarnings() {
            return new Promise(resolve => {
                this.axios.get(`/users/${this.authenticationStore.user.email}/earnings`)
                .then(response => this.earnings = response.data)
                .catch(err => console.log(err))
                .finally(() => resolve());
            })
        },
        async loadChartData(year) {
            let earningsByYear = this.earnings.find(earning => earning.year == year);
            this.totalEarnings = earningsByYear ? earningsByYear.total : 0;
            this.barchartData = earningsByYear ? earningsByYear.totalPerMonth.map(total => total.totalAmount) : [];
        }
    }
}
</script>

<style scoped>
#earnings_container {
    background: url('../../assets/earnings.jpg') no-repeat;
    background-size: cover;
    height: 100vh;
}
</style>