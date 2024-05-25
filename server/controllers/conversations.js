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

module.exports = {
    getMany
}