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

async function getAppointmentsForDoctor(email, date) {
  const mainStages = [
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
    }
  ]

  let stages;

  // if we get the date as a parameter, we need the appointments from that spefici date that are not canceled
  // in order to set available hours for a new appointment
  if(date) {
    stages = [
      ...mainStages,
      {
        $addFields: {
          dateAsString: {
            $dateToString: {
              format: "%m/%d/%Y",
              date: "$dateAndTime"
            }
          },
          hourAsString: {
            $dateToString: {
              format: "%H:%M",
              date: "$dateAndTime"
            }
          }
        }
      },
      {
        $match: {
          dateAsString: date,
          status: { $ne: "canceled" }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$dateAsString",
          hour: "$hourAsString"
        }
      }
    ]
  } else {
    stages = [
      ...mainStages,
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
    ]
  }

  return await Appointments.aggregate(stages);
}

module.exports = {
    getAppointmentsForPatient,
    getAppointmentsForDoctor
}