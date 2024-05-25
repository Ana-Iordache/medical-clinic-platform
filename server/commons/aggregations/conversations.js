const Conversations = require('../../models/Conversations');

async function getConversationsByUserEmail(userEmail) {
    return await Conversations.aggregate([
        {
            $match: {
              usersEmail: {
                $in: [userEmail]
              }
            }
        },
        {
          $lookup: {
            from: "users",
            localField: "usersEmail",
            foreignField: "email",
            as: "usersInfo"
          }
        },
        {
          $project: {
            messages: 1,
            usersInfo: {
              $map: {
                input: "$usersInfo",
                as: "user",
                in: {
                  email: "$$user.email",
                  profilePhotoUrl: "$$user.profilePhotoUrl",
                  fullName: {
                    $concat: [ "$$user.firstName", " ", "$$user.lastName" ]
                  }
                }
              }
            }
          }
        }
    ])
}

module.exports = {
    getConversationsByUserEmail
}