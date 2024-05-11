<template>
    <div class="d-flex h-100">
        <div class="first_section flex-1-0 align-self-center">
            <v-img src="../../assets//login.jpg"></v-img>
        </div>
        <div class="second_section">
            <div class="d-flex flex-column align-center">
                <div class="text-h4 text-white mt-10">Sign up</div>
            </div>

            <v-form ref="form" @submit.prevent="submitForm" class="flex-grow-1">
                <v-window v-model="currentStep" class="mt-10">
                    <div class="text-subtitle-1 text-white additional_info">{{ formSteps[currentStep] }}</div>
                    <v-window-item :value="0">
                        <div class="form_inputs_section">
                            <div class="one_line_inputs">
                                <v-text-field
                                    v-model="userData.firstName"
                                    ref="first_name_input"
                                    :rules="[rules.requiredField]"
                                    label="First name*"
                                    type="text"
                                    variant="solo" 
                                    prepend-inner-icon="mdi mdi-account"
                                ></v-text-field>
                                <v-text-field
                                    v-model="userData.lastName"
                                    ref="last_name_input"
                                    :rules="[rules.requiredField]"
                                    label="Last name*"
                                    type="text"
                                    variant="solo" 
                                    prepend-inner-icon="mdi mdi-account"
                                ></v-text-field>
                            </div>
                            <v-text-field
                                v-model="userData.cnp"
                                ref="cnp_input"
                                label="Personal identification (CNP)*"
                                :rules="[rules.requiredField, rules.thirthteenCharacters]"
                                type="text"
                                variant="solo" 
                                prepend-inner-icon="mdi mdi-card-account-details-outline"
                                @input="handleOnlyNumbersInput($event, 'cnp')"
                            ></v-text-field>
                            <v-text-field
                                v-model="userData.phoneNumber"
                                ref="phone_number_input"
                                label="Phone number*"
                                :rules="[rules.requiredField, rules.tenCharacters]"
                                type="text"
                                variant="solo" 
                                prepend-inner-icon="mdi mdi-phone"
                                @input="handleOnlyNumbersInput($event, 'phoneNumber')"
                            ></v-text-field>
                            <v-text-field
                                v-model="userData.address"
                                label="Address"
                                type="text"
                                variant="solo" 
                                prepend-inner-icon="mdi mdi-home"
                            ></v-text-field>
                            <div class="one_line_inputs">
                                <v-text-field
                                    v-model="userData.height"
                                    label="Height"
                                    type="number"
                                    variant="solo" 
                                    prepend-inner-icon="mdi mdi-human-male-height-variant"
                                ></v-text-field>
                                <v-text-field
                                    v-model="userData.weight"
                                    label="Weight"
                                    type="number"
                                    variant="solo" 
                                    prepend-inner-icon="mdi mdi-weight-kilogram"
                                ></v-text-field>
                            </div>
                        </div>
                    </v-window-item>

                    <v-window-item :value="1">
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
                                :rules="[rules.requiredField, rules.password]"
                                label="Password"
                                :type="showPassword ? 'text' : 'password'"
                                variant="solo"
                                prepend-inner-icon="mdi mdi-lock" 
                                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append-inner="showPassword = !showPassword"
                            ></v-text-field>
                            <ul class="text-subtitle-2 text-white text-white font-italic font-weight-regular">
                                <li v-for="(ruleName, index) in Object.keys(passwordRules)" :key="index" :class="{ 'text-red-darken-4': !passwordRules[ruleName].isValid }">
                                    <div> {{ passwordRules[ruleName].text }} </div>
                                </li>
                            </ul>
                        </div>
                        <div class="d-flex justify-center mt-5 signup_button_section">
                            <v-btn variant="tonal" color="white" class="px-10 w-100" type="submit">
                                Create account
                            </v-btn>
                        </div>
                    </v-window-item>
                    <div class="text-subtitle-1 text-white font-italic additional_info font-weight-thin">All fields marked with '*' are required.</div>
                </v-window>

                <div class="d-flex flex-row" :class="currentStep > 0 ?  'justify-start' : 'justify-end'">
                    <v-btn v-if="currentStep == 1" variant="text" prepend-icon="mdi mdi-arrow-left" color="white" @click="currentStep--">
                        Back
                    </v-btn>
                    
                    <v-btn v-if="currentStep == 0" variant="text" append-icon="mdi mdi-arrow-right" color="white" @click="goToNextStep()">
                        Next
                    </v-btn>

                </div>
            </v-form>

            <div class="text-white d-flex justify-center mb-3 pointer_on_hover" @click="redirectToLogInForm">
                <p>Already registered?</p>
                <p class="ms-1 font-weight-bold">Log in</p>
            </div>
        </div>
    </div>
</template>

<script>
import generalMixin from "@/commons/mixins";
import router from "@/router";

export default {
    name: 'SignUpForm',
    mixins: [generalMixin],
    data: () => ({
        userData: {
            firstName: "",
            lastName: "",
            cnp: "",
            phoneNumber: "",
            address: "",
            bloodType: "",
            height: "",
            weight: "",
            email: "",
            password: ""
        },
        formSteps: ["Personal information", "Account information"],
        currentStep: 0,
        showPassword: false,
        passwordRules: {
            maxLength:               { text: "Password must be at least 6 characters long.",         isValid: false },
            containsLowerCaseLetter: { text: "Password must contain at least one lowercase letter.", isValid: false },
            containsUpperCaseLetter: { text: "Password must contain at least one uppercase letter.", isValid: false },
            containsDigit:           { text: "Password must contain at least one digit.",            isValid: false }
        }
    }),
    methods: {
        async submitForm() {
            let formValidation = await this.$refs.form.validate();
            if (formValidation.valid) {
                // TODO
            }
        },

        handleOnlyNumbersInput(event, inputName) {
            this.userData[inputName] = this.onlyNumbersInput(event.target.value);
        },

        async goToNextStep() {
            const personalInfoFieldsAreValid = await this.validatePersonalInfoFields();
            if(personalInfoFieldsAreValid) {
                this.currentStep++;
            }
        },
        
        async validatePersonalInfoFields() {
            const firstNameIsValid = Object.values(await this.$refs.first_name_input.validate()).length == 0;
            const lastNameIsValid = Object.values(await this.$refs.last_name_input.validate()).length == 0;
            const cnpIsValid = Object.values(await this.$refs.cnp_input.validate()).length == 0;
            const phoneNumberIsValid = Object.values(await this.$refs.phone_number_input.validate()).length == 0;

            return firstNameIsValid && lastNameIsValid && cnpIsValid && phoneNumberIsValid;
        },

        redirectToLogInForm() {
            router.push({ path: '/login'})
        }
    },

    watch: {
        'userData.password'(newValue) {
            this.passwordRules.maxLength.isValid = newValue.length >= 6;
            this.passwordRules.containsLowerCaseLetter.isValid = newValue.search(/[a-z]/) >= 0;
            this.passwordRules.containsUpperCaseLetter.isValid = newValue.search(/[A-Z]/) >= 0;
            this.passwordRules.containsDigit.isValid = newValue.search(/[0-9]/) >= 0;
        }
    }
}
</script>

<style scoped>
.one_line_inputs {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.signup_button_section {
    margin: 5rem;
}

.additional_info {
    padding: 0 5rem;
}
</style>