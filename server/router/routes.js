const express = require('express');
const router = express.Router();
const { requestHandler } = require('./middlewares')

router.get('/', (req, res) => {
    res.send('Hello, World!');
});

module.exports = router;