<template>
    <v-form class="form_container" @submit.prevent="submitForm" ref="form">
        <v-text-field 
            label="Email" 
            type="email" 
            variant="solo" 
            prepend-inner-icon="mdi mdi-email"
            :rules="[rules.requiredField]" 
            v-model="email"></v-text-field>

        <v-btn type="submit" variant="tonal">Send email</v-btn>
    </v-form>
</template>

<script>
import generalMixin from "@/commons/mixins";
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export default {
    name: 'ResetPasswordForm',
    mixins: [generalMixin],
    emits: ['email-sent'],
    data: () => ({
        email: ""
    }),
    methods: {
        async submitForm() {
            let formValidation = await this.$refs.form.validate();
            if (formValidation.valid) {
                await this.sendResetPasswordEmail(this.email);
            }
        },
        async sendResetPasswordEmail(email) {
            const auth = getAuth();
            sendPasswordResetEmail(auth, email)
            .then(() => {
                this.$emit('email-sent', true)
            })
            .catch(error => {
                console.error(error);
                this.$emit('email-sent', false)
            });
        }
    }
}
</script>