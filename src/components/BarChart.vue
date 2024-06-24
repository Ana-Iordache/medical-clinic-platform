<template>
    <div class="chart_wrapper">
        <Bar :options="options" :data="chartData"></Bar>
    </div>
</template>

<script>
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: {
        Bar
    },
    props: {
        data: {
            type: Array,
            required: true
        },
        labels: {
            type: Array,
            required: true
        },
        title: {
            tyoe: String,
            required: true
        }
    },
    data: () => ({
        options: {
            responsive: true,
            maintainAspectRatio: false
        },
    }),
    computed: {
        chartData() {
            return {
                labels: this.labels,
                datasets: [{
                    label: this.title,
                    data: this.data,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    borderRadius: 5,
                    borderSkipped: false,
                }]
            }
        }
    }
}
</script>

<style scoped>
.chart_wrapper {
    background-color: rgba(255, 255, 255, 0.8);
    border: 1px solid #c5c5c5;
    border-radius: .5rem;
    margin: 0 1rem;
    height: 80%;
}
</style>