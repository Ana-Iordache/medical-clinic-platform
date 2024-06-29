<template>
    <v-toolbar color="transparent" class="px-4">
        <div>
            <v-select v-model="selectedYear" 
                :items="[2022, 2023, 2024]"
                variant="solo"
                max-width="200px"
                hide-details
                density="comfortable"
                label="Year"
                >
            </v-select>
        </div>
        <div>
            <v-btn variant="outlined" 
                append-icon="mdi-file-download" 
                color="#4091BE" 
                :text="`Export ${selectedYear}`" 
                :title="`Download data for ${selectedYear}`"
                @click="exportData(selectedYear)"
                class="me-2">
            </v-btn>
            <v-btn variant="outlined" 
                append-icon="mdi-file-download" 
                color="#4091BE" 
                text="Export all" 
                title="Download data for all years"
                @click="exportData()">
            </v-btn>
        </div>
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
import BaseBarChart from '@/components/charts/BaseBarChart.vue';
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
        },
        exportData(year) {            
            let csvContent = 'Month/Year';
            if(year) {
                csvContent += `,${year}\n`;
                this.months.forEach(month => {
                    let monthIndex = this.months.indexOf(month);
                    let row = `${month},${this.barChartData[monthIndex]}\n`;
                    csvContent += row;
                }) 
            } else {
                const allYears = this.data.map(item => item.year).join(',');
                csvContent += `,${allYears}\n`;
                
                this.months.forEach(month => {
                    let row = `${month}`;
                    this.data.forEach(currentYearData => {
                        let monthIndex = this.months.indexOf(month);
                        row += `,${currentYearData.totalPerMonth[monthIndex].totalAmount}`;
                    })
                    row += '\n';
                    csvContent += row;
                })
            }
        
            const anchor = document.createElement('a');
            anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
            anchor.target = '_blank';
            anchor.download = year ? `${this.typeOfData}_${year}.csv` : `${this.typeOfData}.csv`;
            anchor.click();
        }
    }
}
</script>