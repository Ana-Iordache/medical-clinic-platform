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

  // if we get the date as a parameter, we need the appointments from that specific date that are not canceled
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

async function getTotalVisitsPerDoctor() {
  return await Appointments.aggregate([
    {
      $match: {
        status: "honored"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "doctorEmail",
        foreignField: "email",
        as: "doctorInfo"
      }
    },
    {
      $unwind: "$doctorInfo"
    },
    {
      $group: {
        _id: "$doctorEmail",
        totalVisits: {
          $sum: 1
        },
        doctorFirstName: {
          $first: "$doctorInfo.firstName"
        },
        doctorLastName: {
          $first: "$doctorInfo.lastName"
        },
        specialization: {
          $first: "$doctorInfo.specialization"
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalVisits: 1,
        doctorFirstName: "$doctorFirstName",
        doctorLastName: "$doctorLastName",
        specialization: 1
      }
    },
    {
      $sort: {
        totalVisits: -1
      }
    }
  ])
}

async function getTotalPerStatusOfUser(userEmail, userRole, groupingField) {
  const emailProperty = `${userRole}Email`;
  const groupProperty = groupingField == 'appointments' ? '$status' : '$invoice.status';
  return await Appointments.aggregate([
    {
      $match: {
        [emailProperty]: userEmail
      }
    },
    {
      $group: {
        _id: groupProperty,
        total: {
          $sum: 1
        }
      }
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        total: 1
      }
    }
  ]);
}

async function getNextAppointmentOfUser(userEmail, userRole) {
  const emailProperty = `${userRole}Email`;
  return await Appointments.aggregate([
    {
      $match: {
        [emailProperty]: userEmail,
        dateAndTime: {
          $gte: new Date()
        }
      }
    },
    {
      $sort: {
        dateAndTime: 1
      }
    },
    {
      $limit: 1
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
        _id: 0,
        dateAndTime: 1,
        specialization:
          "$doctorDetails.specialization"
      }
    }
  ]);
}

async function countPatientsOfDoctor(userEmail) {
  return await Appointments.aggregate([
    {
      $match: {
        doctorEmail: userEmail
      }
    },
    {
      $group: {
        _id: "$patientEmail"
      }
    },
    {
      $count: "totalPatients"
    }
  ])
}

module.exports = {
    getAppointmentsForPatient,
    getAppointmentsForDoctor,
    getTotalVisitsPerDoctor,
    getTotalPerStatusOfUser,
    getNextAppointmentOfUser,
    countPatientsOfDoctor
}