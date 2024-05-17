<template>
    <div id="payments_container" class="page_container">
        <div class="text-h4 page_title"> Payments </div>
        <div class="page_content_overlay">
            <v-toolbar color="transparent" class="px-4">
                <v-select v-model="selectedFilter" 
                    :items="filterStatuses"
                    variant="solo"
                    max-width="200px"
                    hide-details
                    density="comfortable"
                    >
                </v-select>
                <v-text-field
                    v-model="search"
                    density="comfortable"
                    placeholder="Search"
                    prepend-inner-icon="mdi-magnify"
                    max-width="300px"
                    variant="solo"
                    clearable
                    hide-details
                ></v-text-field>
            </v-toolbar>

            <v-divider color="white" class="border-opacity-50 ma-2"></v-divider>

            <div v-if="paymentsFiltered.length == 0" class="d-flex flex-column align-center justify-center mt-4">
                <div class="text-subtitle-2">No payments found.</div>
                <v-icon size="70" class="mt-4">mdi-credit-card-off</v-icon>
            </div>

            <v-data-iterator v-else :items="paymentsFiltered" :items-per-page="6" :search="search">
                <template v-slot:default="{ items }">
                    <v-container class="pa-2" fluid>
                        <v-row dense>
                            <v-col v-for="item in items" :key="item._id" cols="auto" md="4">
                                <PaymentCard :item="item.raw"></PaymentCard>
                            </v-col>
                        </v-row>
                    </v-container>
                </template>

                <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
                    <div class="d-flex align-center justify-center pa-4">
                    <v-btn
                        :disabled="page === 1"
                        density="comfortable"
                        icon="mdi-arrow-left"
                        variant="tonal"
                        rounded
                        @click="prevPage"
                    ></v-btn>

                    <div class="mx-2 text-caption">
                        Page {{ page }} of {{ pageCount }}
                    </div>

                    <v-btn
                        :disabled="page >= pageCount"
                        density="comfortable"
                        icon="mdi-arrow-right"
                        variant="tonal"
                        rounded
                        @click="nextPage"
                    ></v-btn>
                    </div>
                </template>
            </v-data-iterator>
        </div>
    </div>

    <v-snackbar v-model="confirmation.show"
        :timeout="4000" 
        :color="confirmation.success ? 'green-lighten-1' : 'red-lighten-1'" 
        elevation="24">
        <v-icon>{{ confirmation.success ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}</v-icon>
        {{ confirmation.message }}
    </v-snackbar>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '../../pinia_stores/authenticationStore';
import PaymentCard from '@/components/PaymentCard.vue';

export default {
    name: 'PaymentsPage',
    components: {
        PaymentCard
    },
    data: () => ({
        filterStatuses: [ "All", "Paid", "Unpaid", "Canceled" ],
        selectedFilter: "All",
        paymentsList: [],
        search: "",
        confirmation: {
            show: false,
            success: true,
            message: ""
        }
    }),
    async mounted() {
        if(this.currentUserConnected)
            await this.loadPayments();

        this.checkIfAPaymentHasBeenMade();
    },
    computed: {
        ...mapStores(useAuthenticationStore),
        currentUserConnected() {
            return this.authenticationStore.user;
        },
        paymentsFiltered() {
            return this.selectedFilter == "All" ? this.paymentsList : this.paymentsList.filter(payment => payment.status == this.selectedFilter.toLocaleLowerCase());
        }
    },
    watch: {
        async currentUserConnected(newUser) {
            if(newUser) {
                await this.loadPayments();
            }
        }
    },
    methods: {
        loadPayments() {
            return new Promise(resolve => {
                this.axios.get(`/users/${this.currentUserConnected.email}/payments`)
                    .then(response => this.paymentsList = response.data)
                    .catch(error => console.error(error))
                    .finally(() => resolve());
            })
        },
        checkIfAPaymentHasBeenMade() {
            const paymentStatusQueryParam = this.$route.query.paymentStatus;
            if(paymentStatusQueryParam) {
                this.confirmation = {
                    show: true,
                    success: paymentStatusQueryParam == "paid",
                    message: this.getPaymentConfirmationMessage(paymentStatusQueryParam)
                }
                this.removeQueryParamFromRoute("paymentStatus");
            }
        },
        getPaymentConfirmationMessage(paymentStatus) {
            switch(paymentStatus) {
                case "paid":
                    return "The payment has been made successfully.";
                case "canceled":
                    return "The payment has been canceled.";
                default:
                    return `The payment has failed with status: ${paymentStatus}.`
            }
        },
        removeQueryParamFromRoute(queryParam) {
            const queryParams = { ...this.$route.query };
            delete queryParams[queryParam];
            this.$router.replace({ query: queryParams });
        }
    }
}
</script>

<style scoped>
#payments_container {
    background: url('../../assets/payments.jpg') no-repeat;
    background-size: cover;
    height: 100vh;
}
</style>