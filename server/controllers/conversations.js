const Conversations = require("./../models/Conversations");
const { getConversationsByUserEmail } = require("../commons/aggregations/conversations");

// GET /users/:userEmail/conversations
async function getMany(req, res) {
    const userEmail = req.params.userEmail;

    let conversations = await getConversationsByUserEmail(userEmail);
    if(conversations.length > 0) {
        res.status(200).json(conversations);
    } else {
        res.status(404).json({ message: "Conversations not found." });
    }
}

// POST /users/:userEmail/conversations
async function addOne(req, res) {
    const { receiverEmail, seen, message, dateAndTime } = req.body;
    const transmitterEmail = req.params.userEmail;

    const conversation = new Conversations({
        usersEmail: [transmitterEmail, receiverEmail],
        messages: [{ 
            transmitterEmail: transmitterEmail,
            receiverEmail: receiverEmail,
            seen: seen,
            message: message,
            dateAndTime: dateAndTime
        }]
    });

    const conversationAdded = await conversation.save();
    if(conversationAdded) {
        console.log("Conversation added: ", conversationAdded);
        res.status(200).json({ message: "Conversation created successfully." });
    } else {
        console.log("Failed to create conversation: ", err);
        res.status(500).json({ message: "Failed to create conversation." });
    }
}

// PATCH /users/:userEmail/conversations/:conversationId
async function updateOne(req, res) {
    const conversationId = req.params.conversationId;
    const { receiverEmail, seen, message, dateAndTime } = req.body;
    const transmitterEmail = req.params.userEmail;

    const newMessage = {
        transmitterEmail: transmitterEmail,
        receiverEmail: receiverEmail,
        seen: seen,
        message: message,
        dateAndTime: dateAndTime
    }

    const conversationUpdated = await Conversations.findOneAndUpdate({ _id: conversationId }, { $push: { messages: newMessage } }, { new: true } );

    if(conversationUpdated) {
        console.log("Conversation updated: ", conversationUpdated);
        res.status(200).json({ message: "Conversation updated successfully." });
    } else {
        console.log("Failed to update conversation: ", err);
        res.status(500).json({ message: "Failed to update conversation." });
    }
}

module.exports = {
    getMany,
    addOne,
    updateOne
}