async function requestHandler(callback, req, res) {
    if (!callback) {
        res.status(500).json({ error: "Router error. Please check controller callback function." });
        return;
    }

    try {
        await callback(req, res);
    } catch (error) {
        console.error("An error occured: ", error.message);
        res.status(500).json({ error: "An error occured: " + error.message });
    }
}

module.exports = {
    requestHandler
}