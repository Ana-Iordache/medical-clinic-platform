const Appointments = require("../../models/Appointments");

async function getFeedbackForDoctor(email) {
    return await Appointments.aggregate([
        {
          $match: {
            doctorEmail: email,
            feedback: {
              $exists: true
            }
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
            _id: 0,
            appointmentId: "$_id",
            dateAndTime: 1,
            feedback: 1,
            patientEmail: 1,
            patientFullName: {
              $concat: [ "$patientDetails.firstName", " ", "$patientDetails.lastName" ]
            }
          }
        },
        {
          $group: {
            _id: {
              patientEmail: "$patientEmail",
              patientFullName: "$patientFullName"
            },
            feedback: {
              $push: {
                rating: "$feedback.rating",
                review: "$feedback.review",
                dateAndTime: "$dateAndTime",
                appointmentId: "$appointmentId"
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            patientEmail: "$_id.patientEmail",
            patientFullName: "$_id.patientFullName",
            feedback: 1
          }
        }
    ])
}

module.exports = {
    getFeedbackForDoctor
}