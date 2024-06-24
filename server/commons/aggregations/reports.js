const Appointments = require('../../models/Appointments');

async function getReportDataForUser(email, typeOfReport) {
    const typeOfEmail = typeOfReport == 'earnings' ? 'doctorEmail' : 'patientEmail';
    return await Appointments.aggregate([
        {
            $match: {
                [typeOfEmail]: email,
                "invoice.status": "paid"
            }
        },
        {
            $project: {
                year: { $year: "$invoice.dateOfIssue" },
                month: { $month: "$invoice.dateOfIssue" },
                amount: { $toInt: "$invoice.amount" }
            }
        },
        {
            $group: {
                _id: {
                    year: "$year",
                    month: "$month"
                },
                totalAmount: {
                    $sum: "$amount"
                }
            }
        },
        {
            $sort: {
                "_id.year": 1,
                "_id.month": 1
            }
        },
        {
            $group: {
                _id: "$_id.year",
                months: {
                    $push: {
                        month: "$_id.month",
                        totalAmount: "$totalAmount"
                    }
                },
                totalAmount: {
                    $sum: "$totalAmount"
                }
            }
        },
        {
            $project: {
                _id: 0,
                year: "$_id",
                totalPerMonth: "$months",
                total: "$totalAmount"
            }
        }
    ])
}

module.exports = {
    getReportDataForUser
}