const express = require('express');
const router = express.Router();
const { requestHandler } = require('./middlewares')
const users = require('./../controllers/users');
const appointments = require('./../controllers/appointments');
const services = require('./../controllers/services');
const invoices = require('./../controllers/invoices');
const stripePayments = require('./../controllers/stripePayments');

// Users
router.post('/users', (req, res) => requestHandler(users.add, req, res));
router.get('/users', (req, res) => requestHandler(users.getMany, req, res));
router.get('/users/:userInfo', (req, res) => requestHandler(users.getOne, req, res));

// Appointments
router.get('/users/:userEmail/appointments', (req, res) => requestHandler(appointments.getMany, req, res));
router.post('/users/:userEmail/appointments', (req, res) => requestHandler(appointments.add, req, res));
router.patch('/appointments/:appointmentId', (req, res) => requestHandler(appointments.updateById, req, res));

// Invoices
router.get('/users/:userEmail/payments', (req, res) => requestHandler(invoices.getPaymentsOfUser, req, res))

// Services
router.get('/services', (req, res) => requestHandler(services.getAll, req, res));

// Stripe payments
router.get('/success', (req, res) => requestHandler(stripePayments.successPayment, req, res))
router.get('/cancel', (req, res) => requestHandler(stripePayments.cancel, req, res))
router.post('/create-checkout-session', (req, res) => requestHandler(stripePayments.createCheckoutSession, req, res))

module.exports = router;