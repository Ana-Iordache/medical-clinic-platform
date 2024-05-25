<template>
    <v-card>
        <v-toolbar>
          <v-btn icon="mdi-close" @click="closeChat"></v-btn>
          <v-toolbar-title>Conversations</v-toolbar-title>
        </v-toolbar>
    </v-card>
</template>

<script>
export default {
    name: "ChatCard",
    emits: ['close-chat'],
    props: {
        currentUser: {
            type: Object,
            required: true
        }
    },
    methods: {
        closeChat() {
            this.$emit('close-chat');
        }
    },
    async mounted() {
        console.log("current user: ", this.currentUser)
        
    }
}
</script>