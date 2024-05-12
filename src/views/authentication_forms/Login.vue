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

    <!-- TODO: style this a little bit better -->
    <v-dialog v-model="showErrorDialog" persistent width="40%">
        <v-card class="pa-3 text-center">
            <v-card-title>Login failed</v-card-title>
            <v-card-text>
                {{ errorMessage }}
            </v-card-text>
        </v-card>
    </v-dialog>

    <v-snackbar :timeout="4000" :color="resetPassword.emailSent ? 'green-lighten-1' : 'red-lighten-1'" variant="tonal" v-model="resetPassword.showEmailConfirmation">
        <v-icon>{{ resetPassword.emailSent ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}</v-icon>
        {{ resetPassword.emailSent ? 'An email to reset your password has been sent' : 'Email to reset password couldn\'t be sent' }}
    </v-snackbar>
</template>

<script>
import generalMixin from "@/commons/mixins";
import ResetPasswordForm from "@/views/authentication_forms/ResetPassword.vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
        errorMessage: "",
        showErrorDialog: false,
    }),
    methods: {
        async submitForm() {
            let formValidation = await this.$refs.form.validate();
            if (formValidation.valid) {
                await this.loginUser(this.userData);
            }
        },
        async loginUser(user) {
            const auth = getAuth();
            signInWithEmailAndPassword(auth, user.email, user.password)
                .then(async () => {
                    // console.log("User logged in successfully in firebase: ", auth.currentUser);
                    this.$router.push('/home');
                })
                .catch(error => {
                    // console.error(error);
                    switch (error.code) {
                        case 'auth/wrong-password':
                            this.errorMessage = "Incorrect password";
                            break;
                        case 'auth/user-not-found':
                            this.errorMessage = "No account found";
                            break;
                        default:
                            this.errorMessage = "Invalid credentials";
                            break;
                    }

                    this.showErrorDialog = true;
                });
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
            this.$router.push({ path: '/sign_up'})
        }
    },
    watch: {
        showErrorDialog(newValue) {
            if (!newValue)
                return;
            setTimeout(() => this.showErrorDialog = false, 4000);
        }
    },
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