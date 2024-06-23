const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        trim: true
    },
    profilePhotoUrl: {
        type: String,
        required: false,
        trim: true,
        default: ""
    },
    activeAccount: {
        type: Boolean,
        required: false,
        default: true
    },
    
    // for doctors
    specialization: {
        type: String,
        required: false,
        trim: true
    },
    professionalDegree: {
        type: String,
        required: false,
        trim: true
    },
    schedule: {
        type: Array,
        required: false
    },

    // for patients
    address: {
        type: String,
        required: false,
        trim: true
    },
    identityNumber: {
        type: Number,
        required: false,
        trim: true
    },
    birthDate: {
        type: String,
        required: false,
        trim: true
    },
    weight: {
        type: Number,
        required: false,
        trim: true
    },
    height: {
        type: Number,
        required: false,
        trim: true
    },
    bloodType: {
        type: String,
        required: false,
        trim: true
    },
    gender: {
        type: String,
        required: false,
        trim: true
    },
    age: {
        type: Number,
        required: false,
        trim: true
    },
    healthCardUrl: {
        type: String,
        required: false,
        trim: true,
        default: ""
    },
    identityCardUrl: {
        type: String,
        required: false,
        trim: true,
        default: ""
    },
})

const Users = mongoose.model('Users', userSchema);

module.exports = Users;