const Services = require('../models/Services');

// GET /services
async function getAll(req, res) {
    let services = await Services.find({});

    if(services.length) {
        res.status(200).json(services);
    } else {
        res.status(404).json("Services not found.")
    }
}

module.exports = {
    getAll
}