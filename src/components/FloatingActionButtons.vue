<template>
    <v-fab
      icon="mdi-bell"
      location="bottom end"
      absolute
      app
      appear
      color="#4091BE"
      title="Open notifications"
      class="mb-16"
      @click="showDialog('notifications', true)"
    ></v-fab>

    <v-fab
      icon="mdi-chat"
      location="bottom end"
      absolute
      app
      appear
      color="#4091BE"
      title="Open chat"
      @click="showDialog('chat', true)"
    ></v-fab>

    <!-- TODO: notifications component -->
    <v-dialog v-model="dialogs.notifications">
        
    </v-dialog>

    <v-dialog v-model="dialogs.chat" transition="dialog-bottom-transition" fullscreen>
        <ChatCard @close-chat="showDialog('chat', false)" :currentUser="currentUser"></ChatCard>
    </v-dialog>
</template>

<script>
import ChatCard from './ChatCard.vue';
export default {
    name: "FloatingActionButtons",
    components: {
        ChatCard,
    },
    props: {
        currentUser: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        dialogs: {
            notifications: false,
            chat: false
        }
    }),
    methods: {
        showDialog(dialogName, show) {
            this.dialogs[dialogName] = show;
        }
    }
}
</script>