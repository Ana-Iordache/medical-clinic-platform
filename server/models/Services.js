const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    investigations: {
        type: Array,
        required: true
    }
})

const Services = mongoose.model('Services', serviceSchema);

module.exports = Services;