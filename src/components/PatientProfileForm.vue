<template>
    <v-form ref="form" class="ma-5 d-flex flex-column" @submit.prevent="submitForm">
        <div class="one_line_inputs">
            <div class="column">
                <v-text-field
                    v-model="editedData.firstName"
                    :rules="[rules.requiredField]"
                    label="First name*"
                    type="text"
                    variant="solo" 
                    prepend-inner-icon="mdi mdi-account">
                </v-text-field>

                <v-text-field
                    v-model="editedData.lastName"
                    :rules="[rules.requiredField]"
                    label="Last name*"
                    type="text"
                    variant="solo" 
                    prepend-inner-icon="mdi mdi-account">
                </v-text-field>
                <v-text-field
                    v-model="editedData.email"
                    :rules="[rules.requiredField]"
                    label="Email"
                    type="email"
                    variant="solo" 
                    prepend-inner-icon="mdi mdi-email"
                ></v-text-field>
                <v-text-field
                    v-model="editedData.identityNumber"
                    label="Identity number (CNP)*"
                    :rules="[rules.requiredField, rules.thirthteenCharacters]"
                    type="text"
                    variant="solo" 
                    prepend-inner-icon="mdi mdi-card-account-details-outline"
                    @input="handleOnlyNumbersInput($event, 'identityNumber')"
                    readonly
                ></v-text-field>
                <v-text-field
                    v-model="editedData.phoneNumber"
                    label="Phone number*"
                    :rules="[rules.requiredField, rules.tenCharacters]"
                    type="text"
                    variant="solo" 
                    prepend-inner-icon="mdi mdi-phone"
                    @input="handleOnlyNumbersInput($event, 'phoneNumber')"
                ></v-text-field>
                <v-text-field
                    v-model="editedData.address"
                    label="Address"
                    type="text"
                    variant="solo" 
                    prepend-inner-icon="mdi mdi-home"
                ></v-text-field>
            </div>

            <div class="column">
                <v-card class="d-flex justify-center mb-3">
                    <v-avatar :image="profilePhoto" 
                        size="250" 
                        class="pointer_on_hover my-3"
                        @click="triggerFileInput()"
                        title="Click to change you profile picture"
                    ></v-avatar>
                    <input type="file" accept="image/*" @change="handleFileUpload" ref="upload_file_input" hidden>
                </v-card>
                <v-text-field
                    v-model="editedData.height"
                    label="Height"
                    type="number"
                    variant="solo" 
                    prepend-inner-icon="mdi mdi-human-male-height-variant"
                ></v-text-field>
                <v-text-field
                    v-model="editedData.weight"
                    label="Weight"
                    type="number"
                    variant="solo" 
                    prepend-inner-icon="mdi mdi-weight-kilogram"
                ></v-text-field>
                <v-select
                    v-model="editedData.bloodType"
                    label="Blood type"
                    variant="solo"
                    :items="['O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']"
                    prepend-inner-icon="mdi mdi-blood-bag"
                ></v-select>
            </div>
        </div>


        <div class="d-flex flex-column">
            <v-btn type="submit" color="#4091BE" class="my-2">Save changes</v-btn>
            <!-- TODO: change password -->
            <v-btn class="flex-grow-1">change password</v-btn>
        </div>
    </v-form>

    <v-snackbar v-model="confirmation.show"
        :timeout="4000" 
        :color="confirmation.success ? 'green-lighten-1' : 'red-lighten-1'" 
        elevation="24">
        <v-icon>{{ confirmation.success ? 'mdi-check-circle-outline' : 'mdi-close-circle-outline' }}</v-icon>
        {{ confirmation.message }}
    </v-snackbar>
</template>

<script>
import generalMixin from "@/commons/mixins";
import { getAuth, updateEmail } from '@firebase/auth';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default {
    name: "PatientProfileForm",
    props: {
        userData: {
            type: Object,
            required: true
        }
    },
    mixins: [generalMixin],
    data: () => ({
        editedData: {},
        confirmation: {
            show: false,
            success: true,
            message: ""
        }
    }),
    async mounted() {
        this.editedData = {
            email: this.userData.email,
            phoneNumber: this.userData.phoneNumber.toString().substring(1),
            identityNumber: this.userData.identityNumber.toString(),
            firstName: this.userData.firstName,
            lastName: this.userData.lastName,
            weight: this.userData.weight,
            bloodType: this.userData.bloodType,
            profilePhotoUrl: this.userData.profilePhotoUrl,
            address: this.userData.address
        }
    },
    computed: {
        profilePhoto() {
            return this.editedData.profilePhotoUrl ? this.editedData.profilePhotoUrl : require('@/assets/user_profile.jpg')
        }
    },
    methods: {
        async submitForm() {
            let formValidation = await this.$refs.form.validate();
            if (formValidation.valid) {
                if(this.userData.email != this.editedData.email) {
                    await this.updateUserEmail(this.editedData.email);
                }

               await this.updateData();
            }
        },
        updateData() {
            return new Promise(resolve => {
                this.axios.put(`/users/${this.userData._id}?role=patient`, { data: this.editedData })
                .then(response => {
                    this.confirmation = {
                        show: true,
                        success: true,
                        message: response.data.message
                    }
                })
                .catch(error => {
                    this.confirmation = {
                        show: true,
                        success: false,
                        message: error.response.data.message
                    }
                })
                .finally(() => resolve());
            })
        },
        // TODO: firebase doesn't let me change an email if it hasn't been verified
        async updateUserEmail(email) {
            updateEmail(getAuth().currentUser, email)
            .then(() =>{
                // console.log("email updated")
            })
            .catch(() => {
                // console.error("email couldn't be updated: ", error)
                this.editedData.email = this.userData.email;
            })
        },
        handleOnlyNumbersInput(event, inputName) {
            this.editedData[inputName] = this.onlyNumbersInput(event.target.value);
        },
        triggerFileInput() {
            this.$refs.upload_file_input.click();
        },
        async handleFileUpload(e) {
            const file = e.target.files[0];
            if(file) {
                await this.uploadProfilePhoto(file);
            }
        },
        uploadProfilePhoto(file) {
            const storage = getStorage();

            let fileRef = storageRef(storage, 'patients-profile-pictures/' + file.name);
            let uploadTask = uploadBytesResumable(fileRef, file);

            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Observe state change events such as progress, pause, and resume
                        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        this.showLoadingDialog = progress != 100;
                    },
                    (error) => {
                        console.error(error);
                        reject(error);
                    },
                    async () => {
                        // Handle successful uploads on complete
                        try {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            this.editedData.profilePhotoUrl = downloadURL;
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            })
        }
    }
}
</script>

<style scoped>
.column {
    display: flex;
    flex-direction: column;
    flex-basis: 50%;
}
</style>