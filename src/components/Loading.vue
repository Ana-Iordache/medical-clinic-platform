<template>
    <v-list class="py-2" color="primary" elevation="12" rounded="lg">
        <v-list-item prepend-icon="mdi-heart-pulse" :title="`${title}...`">
            <template v-slot:prepend>
                <div class="pe-4">
                    <v-icon color="primary" size="x-large"></v-icon>
                </div>
            </template>

            <template v-slot:append>
                <v-progress-circular color="primary" indeterminate="disable-shrink" size="26"
                    width="3"></v-progress-circular>
            </template>
        </v-list-item>
    </v-list>
</template>

<script>
export default {
    name: "LoadingComponent",
    props: {
        title: {
            type: String,
            default: "Loading data"
        }
    }
}
</script>