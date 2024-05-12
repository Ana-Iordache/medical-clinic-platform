<template>
    <div v-if="authenticationStore.user">
        Hello, {{ currentUserFullName }}
    </div>
</template>

<script>
import { mapStores } from 'pinia';
import { useAuthenticationStore } from '../../pinia_stores/authenticationStore';

export default {
    name: 'HomePage',

    data: () => ({
        
    }),
    
    computed: {
        ...mapStores(useAuthenticationStore),
        currentUserFullName() {
            return `${this.authenticationStore.user.firstName}  ${this.authenticationStore.user.lastName}`;
        }
    }
}
</script>