const Appointments = require("./../models/Appointments");
const { getAppointmentsForPatient, getAppointmentsForDoctor } = require("../commons/aggregations/appointments");
const { setTimeForDate } = require("../commons/utils");

// GET /users/:userEmail/appointments?role=[doctor, patient]
// TODO: maybe I should get the role directly from Users collection
async function getMany(req, res) {
    const role = req.query.role;
    const date = req.query.date;
    const userEmail = req.params.userEmail;

    let appointments;
    if(role == "patient") {
        appointments = await getAppointmentsForPatient(userEmail);
    } else {
        appointments = await getAppointmentsForDoctor(userEmail, date);
    }

    if (appointments.length > 0) {
        res.status(200).json(appointments);
    } else {
        res.status(404).json({ message: "Appointments not found." });
    }
}

// POST /users/:userEmail/appointments
async function add(req, res) {
    const patientEmail = req.params.userEmail;
    const { doctorEmail, date, time, amount, service } = req.body;

    const dateAndTime = setTimeForDate(date, time);

    const currentDate = new Date();
    const dateOfIssue = new Date(currentDate.toISOString());

    // add 30 days to current date to get the due date
    currentDate.setDate(currentDate.getDate() + 30);
    const dueDate = new Date(currentDate.toISOString());

    const invoice = {
        dateOfIssue: dateOfIssue,
        dueDate: dueDate,
        status: "unpaid",
        amount: amount,
        service: service
    }

    const appointment = new Appointments({
        doctorEmail: doctorEmail,
        patientEmail: patientEmail,
        dateAndTime: dateAndTime,
        status: "unset",
        invoice: invoice
    })

    const appointmentAdded = await appointment.save();
    if(appointmentAdded) {
        console.log("Appointment added: ", appointmentAdded);
        res.status(200).json({ message: "Appointment added successfully." });
    } else {
        console.log("Failed to create appointment: ", err);
        res.status(500).json({ message: "Failed to add appointment." });
    }
}

// PATCH /appointments/:appointmentId
async function updateById(req, res) {
    const appointmentId = req.params.appointmentId;
    const { field, value } = req.body;
    const appointmentUpdated = await Appointments.findOneAndUpdate({ _id: appointmentId }, { [field]: value }, { new: true });

    if(appointmentUpdated) {
        console.log("Appointment updated: ", appointmentUpdated);
        res.status(200).json({ message: "Appointment updated successfully." });
    } else {
        console.log("Failed to update appointment: ", err);
        res.status(500).json({ message: "Failed to update appointment." });
    }
}

module.exports = {
    getMany,
    add,
    updateById
}