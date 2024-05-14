const Appointments = require('../models/Appointments');

// GET /users/:userEmail/payments
async function getPaymentsOfUser(req, res) {
    const userEmail = req.params.userEmail;

    let payments = await Appointments.find(
        { patientEmail: userEmail }, 
        { 
            _id: 0, 
            "appointmentId": "$_id", 
            "amount": "$invoice.amount", 
            "dateOfIssue": "$invoice.dateOfIssue", 
            "dueDate": "$invoice.dueDate", 
            "status": "$invoice.status"
        }
    );

    if (payments.length) {
        res.status(200).json(payments);
    } else {
        res.status(404).json("Payments not found.")
    }
}

module.exports = {
    getPaymentsOfUser
}