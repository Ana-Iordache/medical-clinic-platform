<template>
    <div class="chart_wrapper">
        <Pie :data="chartData" :options="options"></Pie>
    </div>
</template>

<script>
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default {
    name: "BasePieChart",
    components: {
        Pie
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
    },
    data: () => ({
        CHART_COLORS: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
        ]
    }),
    methods: {
        getRandomizedColors() {
            const shuffledColors = this.CHART_COLORS.slice().sort(() => 0.5 - Math.random());
            return shuffledColors.slice(0, this.data.length);
        }
    },
    computed: {
        chartData() {
            return {
                labels: this.labels,
                datasets: [{
                    label: 'total',
                    data: this.data,
                    backgroundColor: this.getRandomizedColors(),
                }]
            }
        },
        options() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
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