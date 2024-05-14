<template>
    <div id="services_container" class="page_container">
        <div class="text-h4 page_title"> Services </div>
        <div class="page_content_overlay">
            <!-- TODO: search functionality -->
            <v-expansion-panels class="pa-5">
                <v-expansion-panel v-for="service in servicesList" :key="service._id">
                    <v-expansion-panel-title>{{ service.name }}</v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <v-list>
                            <v-list-item v-for="(investigation, index) in service.investigations" :key="index"
                                :title="investigation.name" :subtitle="`${investigation.price} RON`">
                            </v-list-item>
                        </v-list>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ServicesPage',
    data: () => ({
        servicesList: []
    }),
    async mounted() {
        await this.loadServices();
    },
    methods: {
        loadServices() {
            return new Promise(resolve => {
                this.axios.get('/services')
                    .then(response => this.servicesList = response.data)
                    .catch(error => console.error(error))
                    .finally(() => resolve());
            })
        }
    }
}
</script>

<style scoped>
#services_container {
    background: url('../../assets/services.jpg') no-repeat;
    background-size: cover;
    height: 100vh;
}
</style>