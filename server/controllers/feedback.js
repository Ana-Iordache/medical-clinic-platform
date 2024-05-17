const { getFeedbackForDoctor } = require("../commons/aggregations/feedback")

// GET /users/:userEmail/feedback
async function getMany(req, res) {
    const userEmail = req.params.userEmail;
    const allFeedback = await getFeedbackForDoctor(userEmail);

    if(allFeedback.length > 0) {
        res.status(200).json(allFeedback);
    } else {
        res.status(404).json({ message: "Feedback not found." });
    }
}

module.exports = {
    getMany
}