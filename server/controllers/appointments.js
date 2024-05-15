const { getAppointmentsForPatient, getAppointmentsForDoctor } = require("../commons/aggregations/appointments");

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

module.exports = {
    getMany
}