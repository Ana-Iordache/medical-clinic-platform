const express = require('express');
const router = express.Router();
const { requestHandler } = require('./middlewares')
const users = require('./../controllers/users');

// Users
router.post('/users', (req, res) => requestHandler(users.add, req, res));

module.exports = router;