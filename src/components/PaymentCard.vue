<template>
    <v-card class="pb-3" border flat>
        <div class="d-flex justify-center align-center text-button my-2" :class="getColorClass(item.status)">
            <div> {{ item.status }} </div>
            <v-icon>{{ getIconStatus(item.status) }}</v-icon>
        </div>

        <v-divider color="#c6c6c6" class="border-opacity-50 mx-4 mb-2"></v-divider>

        <div class="d-flex flex-row justify-space-around">
            <v-list-item title="Date of issue" :subtitle="getDateStringFromDate(parseDateAndTimeString(item.dateOfIssue))"></v-list-item>
            <v-list-item title="Due date" :subtitle="getDateStringFromDate(parseDateAndTimeString(item.dueDate))"></v-list-item>
        </div>
        <div class="d-flex flex-row justify-space-between ma-3 font-weight-bold">
            <div>Amount</div>
            <div>{{ item.amount }} RON</div>
        </div>
        <!-- TODO: payment -->
        <div class="px-3">
            <v-btn :variant="isNotUnpaid ? 'outlined' : 'tonal'" color="#4091BE" width="100%" :disabled="isNotUnpaid" @click="prepareForPayment(this.item)">
                Pay
            </v-btn>
        </div>
    </v-card>
</template>

<script>
import generalMixin from '@/commons/mixins';

export default {
    name: "PaymentCard",
    props: {
        item: {
            type: Object,
            required: true
        },
    },
    mixins: [generalMixin],
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
        async prepareForPayment(invoice) {
            let invoiceDetails = {
                appointmentId: invoice.appointmentId,
                amount: invoice.amount
            }
            let productsToPay = this.generateProductsToPayArray(invoice);
            await this.redirectToPayment(productsToPay, invoiceDetails);
        },
        redirectToPayment(productsToPay, invoiceDetails) {
            return new Promise(resolve => {
                this.axios.post("/create-checkout-session", { productsToPay: productsToPay,  details: invoiceDetails })
                    .then(response => response.data)
                    .then(data => {
                        window.location.href = data.url;
                    })
                    .catch(error => console.error(error))
                    .finally(() => resolve());
            })
        },
        generateProductsToPayArray(invoice) {
            let products = [ 
                {
                    price_data: {
                        currency: "ron", // TODO: maybe this should be configurable (in the entire app)
                        product_data: {
                            name: invoice.service ?? "Medical service" // TODO: not all the invoice have services saved, I should update the data in db
                        },
                        unit_amount: this.getUnitAmount(invoice.amount)
                    },
                    quantity: 1
                }
            ]
            return products;
        },
        getUnitAmount(value) {
            return Math.round(value * 100);
        }
    },
    computed: {
        isNotUnpaid() {
            return this.item.status != 'unpaid';
        }
    }
}
</script>