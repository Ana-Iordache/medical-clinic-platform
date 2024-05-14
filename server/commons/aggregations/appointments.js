const Appointments = require('../../models/Appointments');

async function getAppointmentsForPatient(email) {
    return await Appointments.aggregate([
        {
          $match: {
            patientEmail: email
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "doctorEmail",
            foreignField: "email",
            as: "doctorDetails"
          }
        },
        {
          $unwind: "$doctorDetails"
        },
        {
          $project: {
            _id: 1,
            dateAndTime: 1,
            status: 1,
            prescriptionUrl: 1,
            feedback: 1,
            doctorFullName: {
              $concat: [ "$doctorDetails.firstName", " ", "$doctorDetails.lastName" ]
            },
            doctorProfessionalDegree: "$doctorDetails.professionalDegree",
            specialization: "$doctorDetails.specialization"
          }
        }
    ])
}

async function getAppointmentsForDoctor(email) {
    return await Appointments.aggregate([
        {
          $match: {
            doctorEmail: email
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "patientEmail",
            foreignField: "email",
            as: "patientDetails"
          }
        },
        {
          $unwind: "$patientDetails"
        },
        {
          $project: {
            _id: 1,
            dateAndTime: 1,
            status: 1,
            prescriptionUrl: 1,
            patientFullName: {
                $concat: [ "$patientDetails.firstName", " ", "$patientDetails.lastName" ]
            }
          }
        }
    ])
}

module.exports = {
    getAppointmentsForPatient,
    getAppointmentsForDoctor
}