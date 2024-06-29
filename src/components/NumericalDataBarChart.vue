<template>
    <BaseBarChart
        :title="title"
        :data="chartData"
        :labels="chartLabels"
        :labelTitle="labelTitle">
    </BaseBarChart>
</template>

 <!-- TODO: this component needs to be more generic -->
<script>
import BaseBarChart from '@/components/BaseBarChart.vue';
export default {
    name: "NumericalDataBarChart",
    components: {
        BaseBarChart
    },
    props: {
        title: {
            type: String
        },
        data: {
            type: Array
        },
        labelTitle: {
            type: String
        },
        typeOfData: {
            type: String
        }
    },
    computed: {
        chartLabels() {
            return this.data ? this.data.map(item => `${this.getInitialsOfFirstName(item.doctorFirstName)} ${item.doctorLastName} (${item.specialization})`) : [];
        },
        chartData() {
            return this.data ? this.data.map(item => item[this.typeOfData]) : [];
        },
    },
    methods: {
        getInitialsOfFirstName(firstName) {
            let nameSplitted = firstName.split(' ');
            let initials = nameSplitted.map(name => name.charAt(0));
            return initials.join('. ') + '.';
        }
    }
}
</script>