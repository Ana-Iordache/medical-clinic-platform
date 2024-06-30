const Users = require("./../models/Users")
const { getTopAppreciatedDoctors, getTopVisitedDoctors, getTotalPatientsOfDoctor } = require("../commons/intermediateFunctions/homeDashboard")
const { getTotalPerStatusOfUser, getNextAppointmentOfUser } = require("../commons/aggregations/appointments")

// GET /users/:userEmail/homedashboard
async function getReport(req, res) {
    const userEmail = req.params.userEmail;
    const userRole = (await Users.findOne({ email: userEmail })).role;

    let homeDashboardObj = {};
    
    let totalAppointmentsPerStatus = await getTotalPerStatusOfUser(userEmail, userRole, 'appointments');
    let totalPaymentsPerStatus = await getTotalPerStatusOfUser(userEmail, userRole, 'payments');
    let nextAppointment = await getNextAppointmentOfUser(userEmail, userRole);

    homeDashboardObj = {
        totalAppointmentsPerStatus: totalAppointmentsPerStatus,
        totalPaymentsPerStatus: totalPaymentsPerStatus,
        nextAppointment: nextAppointment[0]
    }

    if(userRole == 'patient') {
        let topAppreciatedDoctors = await getTopAppreciatedDoctors(5);
        let topVisitedDoctors = await getTopVisitedDoctors(5);

        homeDashboardObj.topAppreciatedDoctors = topAppreciatedDoctors;
        homeDashboardObj.topVisitedDoctors = topVisitedDoctors;
    } else if(userRole =='doctor') {
        let totalPatients  = await getTotalPatientsOfDoctor(userEmail);
        homeDashboardObj.totalPatients = totalPatients[0].totalPatients;
    }

    res.status(200).json(homeDashboardObj);
}

module.exports = {
    getReport
}