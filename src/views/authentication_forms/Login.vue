<template>
    <div class="d-flex h-100">
        <div class="first_section flex-1-0 align-self-center">
            <v-img src="../../assets//login.jpg"></v-img>
        </div>
        <div class="second_section">
            <div class="d-flex flex-column align-center">
                <div class="text-h4 text-white mt-10">Welcome back!</div>
                <div class="text-subtitle-1 text-white mt-5">Login to your account</div>
            </div>

            <v-form ref="form" @submit.prevent="submitForm" class="flex-grow-1 mt-10">
                <div class="form_inputs_section">
                    <v-text-field
                        v-model="userData.email"
                        :rules="[rules.requiredField]"
                        label="Email"
                        type="email"
                        variant="solo" 
                        prepend-inner-icon="mdi mdi-email"
                    ></v-text-field>
                    <v-text-field
                        v-model="userData.password"
                        :rules="[rules.requiredField]"
                        label="Password"
                        :type="showPassword ? 'text' : 'password'"
                        variant="solo"
                        prepend-inner-icon="mdi mdi-lock" 
                        :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                        @click:append-inner="showPassword = !showPassword"
                    ></v-text-field>
                </div>
                <div class="d-flex flex-row align-center justify-space-between px-10">
                    <v-checkbox
                        class="remember_me_checkbox"
                        color="white"
                        label="Remember me"
                        hide-details=""></v-checkbox>

                    <div class="text-subtitle-3 text-white forgot_password" @click="dismissPasswordDialog(false)">Forgot password?</div>
                </div>
                <div class="d-flex justify-center mt-5 login_button_section">
                    <v-btn variant="tonal" color="white" class="px-10 w-100" type="submit">
                        Login
                    </v-btn>
                </div>
            </v-form>

            <div class="text-white d-flex justify-center mb-3 pointer_on_hover" @click="redirectToSignUpForm">
                <p>Don't have an account?</p>
                <p class="ms-1 font-weight-bold">Sign up</p>
            </div>
        </div>
    </div>

    <v-dialog v-model="resetPassword.showForgotDialog" width="40%">
        <v-card color="#4091BE" class="pa-3 text-center">
            <v-card-title>Reset password</v-card-title>
            <v-card-text>
                <ResetPasswordForm @email-sent="showConfirmation"></ResetPasswordForm>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import generalMixin from "@/commons/mixins";
import router from "@/router";
import ResetPasswordForm from "@/views/authentication_forms/ResetPassword.vue";

export default {
    name: 'LoginForm',
    components: {
        ResetPasswordForm
    },
    mixins: [generalMixin],
    data: () => ({
        userData: {
            email: "",
            password: ""
        },
        showPassword: false,
        resetPassword: {
            showForgotDialog: false,
            showEmailConfirmation: false,
            emailSent: false,
        },
    }),
    methods: {
        async submitForm() {
            let formValidation = await this.$refs.form.validate();
            if (formValidation.valid) {
                // TODO
            }
        },
        dismissPasswordDialog(dismiss) {
            this.resetPassword.showForgotDialog = !dismiss;
        },
        showConfirmation(emailSent) {
            this.dismissPasswordDialog(true);
            this.resetPassword.emailSent = emailSent;
            this.resetPassword.showEmailConfirmation = true;
        },
        redirectToSignUpForm() {
            router.push({ path: '/sign_up'})
        }
    }
}
</script>

<style scoped>

.forgot_password {
    opacity: 0.6;
}

.forgot_password:hover {
    opacity: 1;
    cursor: pointer;
}

.login_button_section {
    margin: 5rem;
}
</style>