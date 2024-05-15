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
        res.status(404).json("Appointments not found.");
    }
}

// POST /users/:userEmail/appointments
async function add(req, res) {
    const patientEmail = req.params.userEmail;
    const { doctorEmail, date, time, amount } = req.body;

    const dateAndTime = setTimeForDate(date, time);

    // TODO: set dates of the invoice
    const currentDate = new Date();
    const invoice = {
        dateOfIssue: "todo",
        dueDate: "todo",
        status: "unpaid",
        amount: amount
    }

    const appointment = new Appointments({
        doctorEmail: doctorEmail,
        patientEmail: patientEmail,
        dateAndTime: dateAndTime,
        status: "unset",
        invoice: invoice
    })

    try {
        await appointment.save();
        res.status(200).json("Appointment created successfully.");
    } catch (err) {
        console.log("Failed to create appointment: ", err);
        res.status(500).json("Failed to create appointment.");
    }
}

module.exports = {
    getMany,
    add
}