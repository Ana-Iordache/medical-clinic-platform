<template>
    <v-card>
        <v-toolbar color="#4091BE">
          <v-btn icon="mdi-close" @click="closeChat"></v-btn>
          <v-toolbar-title>Conversations</v-toolbar-title>
        </v-toolbar>

        <div class="conversations_content d-flex flex-row h-100">
            <v-col cols="4" class="pa-0">
                <v-list lines="two" class="pa-0">
                    <div v-for="conversation in conversationsList" :key="conversation._id" 
                        class="pointer_on_hover" 
                        title="Click to open chat" 
                        :class="{'selected' : currentConversationId == conversation._id}"
                        @click="setCurrentConversation(conversation._id)">
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

            <!-- TODO: add this to a separate component -->
            <v-col class="pa-0">
                <div v-if="currentConversation" class="current_conversation_section">
                    <v-toolbar>
                        <v-avatar :image="profilePhotoOfOtherUser(currentConversation.usersInfo)" size="55" class="ms-2"></v-avatar>
                        <v-toolbar-title>{{ getNameOfOtherUser(currentConversation.usersInfo) }}</v-toolbar-title>
                    </v-toolbar>
                    <div class="d-flex flex-column flex-grow-1 current_chat_container">
                        <div v-for="(message, index) in currentConversation.messages" 
                            :key="index" 
                            :ref="index == currentConversation.messages.length - 1 ? 'lastMessageDiv' : ''"
                            class="message_card"
                            :class="isMessageOfCurrentUser(message) ? 'transmitter_message' : 'receiver_message'">
                            
                            {{ message.message }}

                        </div>
                        <div v-if="isTransmitterOfLastMessage(currentConversation.messages)" class="align-self-end mb-1 me-3 font-italic text-caption">
                            {{ lastMessageHasBeenSeen(currentConversation.messages) ? 'Seen' : 'Delivered' }}
                            <v-icon size="15">
                                {{ lastMessageHasBeenSeen(currentConversation.messages) ? 'mdi-check-all' : 'mdi-check' }}
                            </v-icon>
                        </div>
                    </div>
                    <div>
                        <v-text-field
                            v-model="newMessage"
                            placeholder="Write a message..."
                            append-inner-icon="mdi-send"
                            variant="outlined"
                            hide-details
                            class="ma-2"
                            @click:append-inner="sendMessage()"
                            >
                        </v-text-field>
                    </div>
                </div>
                <div v-else class="current_conversation_section align-center justify-center">
                    <v-icon size="50" color="">mdi-chat-remove-outline</v-icon>
                    <div>No conversation selected.</div>
                </div>
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
        currentConversationId: null,
        newMessage: null
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
        },
        isMessageOfCurrentUser(message) {
            return message.transmitterEmail == this.currentUser.email;
        },
        setCurrentConversation(conversationId) {
            this.currentConversationId = conversationId;
            this.scrollToLastMessage();
        },
        scrollToLastMessage() {
            this.$nextTick(() => {
                let current_chat_container = this.$el.querySelector(".current_chat_container")
                current_chat_container.scrollTop = current_chat_container.scrollHeight;
            })
        },
        // TODO: send new message
        sendMessage() {
            console.log("newMessage: ", this.newMessage)
        }
    },
}
</script>

<style scoped>
.pointer_on_hover:hover, .selected {
    background-color: rgba(64, 146, 190, 0.116);
}

.conversations_content, .conversations_content .v-col, .current_chat_container {
    overflow: auto;
}

.current_conversation_section {
    display: flex;
    flex-direction: column;
    overflow: auto;
    height: 100%;
    box-shadow: inset 2px 0px 25px 2px rgba(0, 0, 0, 0.2);
    background-color: rgba(64, 146, 190, 0.116);
}

.message_card {
    padding: 1rem;
    margin: .5rem;
    width: fit-content;
    border: 1px solid #c6c6c6;
    border-radius: 1rem;
}

.transmitter_message {
    background-color: rgba(64, 145, 190, 0.25);
    align-self: end;
    border-bottom-right-radius: 0;
}

.receiver_message {
    background-color: white;
    border-bottom-left-radius: 0;
}
</style>