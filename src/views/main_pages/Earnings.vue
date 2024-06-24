<template>
    <div id="earnings_container" class="page_container">
        <div class="text-h4 page_title"> Earnings </div>
        <div class="page_content_overlay">
            <MonthlyDataBarChart 
                :title="'Monthly earnings'"
                :typeOfData="'earnings'">
            </MonthlyDataBarChart>
        </div>
    </div>
</template>

<script>
import MonthlyDataBarChart from '@/components/MonthlyDataBarChart.vue';
export default {
    name: 'EarningsPage',
    components: {
        MonthlyDataBarChart
    },
}
</script>

<style scoped>
#earnings_container {
    background: url('../../assets/earnings.jpg') no-repeat;
    background-size: cover;
    height: 100vh;
}
</style>