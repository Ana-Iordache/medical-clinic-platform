<template>
    <v-card>
        <v-toolbar color="#4091BE">
          <v-btn icon="mdi-close" @click="closeChat"></v-btn>
          <v-toolbar-title>Conversations</v-toolbar-title>
        </v-toolbar>

        <div class="d-flex flex-row h-100">
            <v-col cols="4" class="pa-0">
                <v-list lines="two">
                    <div v-for="conversation in conversationsList" :key="conversation._id" 
                        class="pointer_on_hover" 
                        title="Click to open chat" 
                        :class="{'selected' : currentConversationId == conversation._id}"
                        @click="currentConversationId = conversation._id">
                        <v-list-item :prepend-avatar="profilePhotoOfOtherUser(conversation.usersInfo)">
                            <v-list-item-title class="font-weight-bold">{{ getNameOfOtherUser(conversation.usersInfo) }}</v-list-item-title>
                            <v-list-item-subtitle>
                                <div class="d-flex align-center font-italic">
                                    <v-icon v-if="isTransmitterOfLastMessage(conversation.messages)">
                                        {{ lastMessageHasBeenSeen(conversation.messages) ? 'mdi-check-all' : 'mdi-check' }}
                                    </v-icon>
                                    <div class="me-auto"> {{ getLastMessage(conversation.messages) }} </div>
                                    <v-icon v-if="!isTransmitterOfLastMessage(conversation.messages) && getTotalUnseenMessages(conversation.messages) != 0" color="#4091BE">
                                        {{ getTotalUnseenMessages(conversation.messages) <= 9 ? `mdi-numeric-${getTotalUnseenMessages(conversation.messages)}-circle` : 'mdi-numeric-9-plus-circle' }}
                                    </v-icon>
                                </div>
                            </v-list-item-subtitle>
                        </v-list-item>

                        <v-divider></v-divider>
                    </div>
                </v-list>
            </v-col>

            <!-- TODO: current conversation section -->
            <v-col>
                {{ currentConversation }}
            </v-col>
        </div>
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
    data: () => ({
        conversationsList: [],
        currentConversationId: null
    }),
    async mounted() {
        await this.loadConversations();
    },
    computed: {
        currentConversation() {
            return this.conversationsList.find(conversation => conversation._id == this.currentConversationId);
        }
    },
    methods: {
        closeChat() {
            this.$emit('close-chat');
        },
        loadConversations() {
            return new Promise(resolve => {
                this.axios.get(`/users/${this.currentUser.email}/conversations`)
                    .then(response => this.conversationsList = response.data)
                    .catch(error => console.error(error))
                    .finally(() => resolve());
            })
        },
        getNameOfOtherUser(users) {
            const otherUser = users.find(user => user.email != this.currentUser.email);
            return otherUser.fullName;
        },
        profilePhotoOfOtherUser(users) {
            const otherUser = users.find(user => user.email != this.currentUser.email);
            return otherUser.profilePhotoUrl ? otherUser.profilePhotoUrl : require('@/assets/user_profile.jpg');
        },
        getLastMessage(messages) {
            let messageLength = messages[messages.length - 1].message.length;
            let message = messages[messages.length - 1].message.substring(0, 40);
            return messageLength > 40 ? message + '...' : message;
        },
        isTransmitterOfLastMessage(messages) {
            const lastMessage = messages[messages.length - 1];
            return lastMessage.transmitterEmail == this.currentUser.email;
        },
        lastMessageHasBeenSeen(messages) {
            const lastMessage = messages[messages.length - 1];
            return lastMessage.seen;
        },
        getTotalUnseenMessages(message) {
            const total =  message.reduce((acc, curr) => {
                if(!curr.seen)
                    acc++;
                return acc;
            }, 0);
            return total;
        }
    },
}
</script>

<style scoped>
.pointer_on_hover:hover, .selected {
    background-color: rgba(64, 146, 190, 0.116);
}
</style>