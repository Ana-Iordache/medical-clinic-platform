const express = require('express');
const router = express.Router();
const { requestHandler } = require('./middlewares')
const users = require('./../controllers/users');
const appointments = require('./../controllers/appointments');
const services = require('./../controllers/services');

// Users
router.post('/users', (req, res) => requestHandler(users.add, req, res));
router.get('/users', (req, res) => requestHandler(users.getMany, req, res));
router.get('/users/:userInfo', (req, res) => requestHandler(users.getOne, req, res));

// Appointments
router.get('/users/:userEmail/appointments', (req, res) => requestHandler(appointments.getMany, req, res));

// Services
router.get('/services', (req, res) => requestHandler(services.getAll, req, res));

module.exports = router;