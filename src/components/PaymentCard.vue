<template>
    <v-card class="pb-3" border flat>
        <div class="d-flex justify-center align-center text-button my-2" :class="getColorClass(item.status)">
            <div> {{ item.status }} </div>
            <v-icon>{{ getIconStatus(item.status) }}</v-icon>
        </div>

        <v-divider color="#c6c6c6" class="border-opacity-50 mx-4 mb-2"></v-divider>

        <div class="d-flex flex-row justify-space-around">
            <v-list-item title="Date of issue" :subtitle="item.dateOfIssue"></v-list-item>
            <v-list-item title="Due date" :subtitle="item.dueDate"></v-list-item>
        </div>
        <div class="d-flex flex-row justify-space-between ma-3 font-weight-bold">
            <div>Amount</div>
            <div>{{ item.amount }} RON</div>
        </div>
        <!-- TODO: payment -->
        <div class="px-3">
            <v-btn :variant="item.status != 'paid' ? 'outlined' : 'tonal'" color="#4091BE" width="100%" :disabled="item.status != 'paid'" @click="pay()">
                Pay
            </v-btn>
        </div>
    </v-card>
</template>

<script>
export default {
    name: "PaymentCard",
    props: {
        item: {
            type: Object,
            required: true
        },
    },
    methods: {
        getColorClass(status) {
            switch(status) {
                case "paid":
                    return "text-green";
                case "unpaid":
                case "canceled":
                    return "text-red";
            }
        },
        getIconStatus(status) {
            switch(status) {
                case "paid":
                    return "mdi-credit-card";
                case "unpaid":
                case "canceled":
                    return "mdi-credit-card-off";
            }
        },
        pay() {
            console.log("TODO pay")
        }
    }
}
</script>