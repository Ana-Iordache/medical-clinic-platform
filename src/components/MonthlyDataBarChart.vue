<template>
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
    <div class="pe-4 text-subtitle-2 d-flex justify-end">Total: {{ total }} RON</div>
    <BaseBarChart 
        :data="barChartData"
        :labels="months"
        :title="title"
    ></BaseBarChart>
</template>

<script>
import generalMixin from "@/commons/mixins";
import BaseBarChart from '@/components/BaseBarChart.vue';
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '@/pinia_stores/authenticationStore';
export default {
    name: 'MonthlyDataBarChart',
    mixins: [generalMixin],
    components: {
        BaseBarChart
    },
    props: {
        typeOfData: {
            type: String,
            required: true
        },
        title: {
            type: String
        }
    },
    data: () => ({
        selectedYear: new Date().getFullYear(),
        data: [],
        barChartData: [],
        total: 0
    }),
    async mounted() {
        await this.loadData();
        await this.loadChartData(this.selectedYear);
    },
    watch: {
        selectedYear(newValue) {
            if(newValue)
                this.loadChartData(newValue);
        }
    },
    computed: {
        ...mapStores(useAuthenticationStore)
    },
    methods: {
        loadData() {
            return new Promise(resolve => {
                this.axios.get(`/users/${this.authenticationStore.user.email}/report?type=${this.typeOfData}`)
                .then(response => this.data = response.data)
                .catch(err => console.log(err))
                .finally(() => resolve());
            })
        },
        async loadChartData(year) {
            let dataByYear = this.data.find(item => item.year == year);
            this.total = dataByYear ? dataByYear.total : 0;
            this.barChartData = dataByYear ? dataByYear.totalPerMonth.map(total => total.totalAmount) : [];
        }
    }
}
</script>