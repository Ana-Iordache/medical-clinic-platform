const Users = require("./../models/Users")
const { getTopAppreciatedDoctors, getTopVisitedDoctors } = require("../commons/intermediateFunctions/homeDashboard")
const { getTotalPerStatusOfUser, getNextAppointmentOfUser } = require("../commons/aggregations/appointments")

// GET /users/:userEmail/homedashboard
async function getReport(req, res) {
    const userEmail = req.params.userEmail;
    const userRole = (await Users.findOne({ email: userEmail })).role;

    let homeDashboardObj = {};

    if(userRole == 'patient') {
        let topAppreciatedDoctors = await getTopAppreciatedDoctors(5);
        let topVisitedDoctors = await getTopVisitedDoctors(5);
        let totalAppointmentsPerStatus = await getTotalPerStatusOfUser(userEmail, userRole, 'appointments');
        let totalPaymentsPerStatus = await getTotalPerStatusOfUser(userEmail, userRole, 'payments');
        let nextAppointment = await getNextAppointmentOfUser(userEmail, userRole);

        homeDashboardObj = {
            topAppreciatedDoctors: topAppreciatedDoctors,
            topVisitedDoctors: topVisitedDoctors,
            totalAppointmentsPerStatus: totalAppointmentsPerStatus,
            totalPaymentsPerStatus: totalPaymentsPerStatus,
            nextAppointment: nextAppointment
        }
    }

    res.status(200).json(homeDashboardObj);
}

module.exports = {
    getReport
}