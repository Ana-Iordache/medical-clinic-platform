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

async function getRatingsOfDoctor(email) {
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
      $project: {
        roundedRating: {
          $floor: "$feedback.rating"
        }
      }
    },
    {
      $group: {
        _id: "$roundedRating",
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        _id: 1
      }
    },
    {
      $facet: {
        existingRatings: [
          {
            $project: {
              _id: 1,
              count: 1
            }
          }
        ],
        allRatings: [
          {
            $project: {
              ratings: [1, 2, 3, 4, 5]
            }
          },
          {
            $unwind: "$ratings"
          },
          {
            $project: {
              _id: "$ratings",
              count: {
                $literal: 0
              }
            }
          }
        ]
      }
    },
    {
      $project: {
        combined: {
          $setUnion: [
            "$existingRatings",
            "$allRatings"
          ]
        }
      }
    },
    {
      $unwind: "$combined"
    },
    {
      $group: {
        _id: "$combined._id",
        count: {
          $sum: "$combined.count"
        }
      }
    },
    {
      $group: {
        _id: null,
        totalRatings: {
          $sum: {
            $multiply: ["$_id", "$count"]
          }
        },
        totalCount: {
          $sum: "$count"
        },
        ratings: {
          $push: {
            k: {
              $toString: "$_id"
            },
            v: "$count"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        averageRating: {
          $divide: ["$totalRatings", "$totalCount"]
        },
        totalRatings: "$totalCount",
        ratings: {
          $arrayToObject: "$ratings"
        }
      }
    }
  ])
}

module.exports = {
  getFeedbackForDoctor,
  getRatingsOfDoctor
}