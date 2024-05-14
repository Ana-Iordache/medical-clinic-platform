const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    doctorEmail: {
        type: String,
        required: true,
        trim: true
    },
    patientEmail: {
        type: String,
        required: true,
        trim: true
    },
    dateAndTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true,
        trim: true
    },
    feedback: {
        type: Object,
        required: false
    },
    invoice: {
        type: Object,
        required: true
    },
    prescriptionUrl: {
        type: String,
        required: false,
        trim: true,
        default: ""
    },
})

const Appointments = mongoose.model('Appointments', appointmentSchema);

module.exports = Appointments;