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
    name: 'BaseBarChart',
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
            type: String,
            required: true
        },
        labelTitle: {
            type: String,
            required: true
        }
    },
    computed: {
        chartData() {
            return {
                labels: this.labels,
                datasets: [{
                    label: this.labelTitle,
                    data: this.data,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderWidth: 2,
                    borderRadius: 5,
                    borderSkipped: false,
                }]
            }
        },
        options() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'left',
                    },
                    title: {
                        display: true,
                        text: this.title
                    }
                }
            }
        }
    }
}
</script>