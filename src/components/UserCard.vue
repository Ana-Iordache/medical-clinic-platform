<template>
     <v-card class="pb-3 pointer_on_hover" border flat @click="showUserInfo(item)">
        <div class="text-h6 text-center"> {{ item.firstName }} {{ item.lastName }}</div>

        <div class="user_info_area">
            <!-- TODO: check how it is displayed with an actual photo -->
            <v-avatar :image="getProfilePhotoUrl(item)" size="100"></v-avatar>
            <v-list lines="one">
                <div v-if="item.role == 'doctor'">
                    <v-list-item
                        v-for="info in doctorUserInfo"
                        :key="info"
                        :title="info.title"
                        :subtitle="item[info.key] ?? '-'"
                    ></v-list-item>
                </div>

                <div v-else-if="item.role == 'patient'">
                    <v-list-item
                        v-for="info in patientUserInfo"
                        :key="info"
                        :title="info.title"
                        :subtitle="item[info.key] ?? '-'"
                    ></v-list-item>
                </div>
            </v-list>
        </div>

    </v-card>
</template>

<script>
export default {
    name: "UserCard",
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data: () => ({
        doctorUserInfo: [
            { title: "Professional degree", key: "professionalDegree" },
            { title: "Specialization",      key: "specialization" },
            { title: "Phone",               key: "phoneNumber" }
        ],
        patientUserInfo: [
            { title: "CNP",              key: "identityNumber" },
            { title: "Last appointment", key: "lastAppointment" },
            { title: "Phone",            key: "phoneNumber" }
        ]
    }),
    methods: {
        getProfilePhotoUrl(user) {
           return user.profilePhotoUrl ? user.profilePhotoUrl : require('@/assets/user_profile.jpg');
        },
        showUserInfo(user) {
            let componentName;
            if(user.role == "doctor")
                componentName = 'DoctorInfo';
            else if(user.role == "patient")
                componentName = 'PatientInfo';

            this.$router.push({ 
                name: componentName,  
                params: { id: user._id }
            })
        }
    }
}
</script>

<style scoped>
.user_info_area {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
}
</style>