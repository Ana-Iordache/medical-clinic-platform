const Users = require('./../models/Users');

async function getPatientUsersOfDoctor(doctorEmail) {
    return await Users.aggregate([
        {
            $match: {
                role: "patient"
            }
        },
        {
            $lookup: {
                from: "appointments",
                let: {
                    userEmail: "$email"
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: [
                                    "$patientEmail",
                                    "$$userEmail"
                                ]
                            },
                            doctorEmail: doctorEmail
                        }
                    },
                    {
                        $sort: {
                            dateAndTime: -1
                        }
                    },
                    {
                        $limit: 1
                    }
                ],
                as: "lastAppointment"
            }
        },
        {
            $project: {
                _id: 1,
                firstName: 1,
                lastName: 1,
                profilePhotoUrl: 1,
                phoneNumber: 1,
                role: 1,
                identityNumber: 1,
                lastAppointment: {
                    $arrayElemAt: [ "$lastAppointment.dateAndTime", 0 ]
                }
            }
        },
        {
            $match: {
                lastAppointment: {
                    $ne: null
                }
            }
        }
    ])
}

module.exports = {
    getPatientUsersOfDoctor,
}