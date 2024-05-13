const express = require('express');
const router = express.Router();
const { requestHandler } = require('./middlewares')
const users = require('./../controllers/users');

// Users
router.post('/users', (req, res) => requestHandler(users.add, req, res));
router.get('/users', (req, res) => requestHandler(users.getMany, req, res));
router.get('/users/:userInfo', (req, res) => requestHandler(users.getOne, req, res));

module.exports = router;