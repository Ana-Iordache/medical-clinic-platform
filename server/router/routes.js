const express = require('express');
const router = express.Router();
const { requestHandler } = require('./middlewares')
const users = require('./../controllers/users');
const appointments = require('./../controllers/appointments');
const services = require('./../controllers/services');
const invoices = require('./../controllers/invoices');
const feedback = require('./../controllers/feedback');
const conversations = require('./../controllers/conversations');
const stripePayments = require('./../controllers/stripePayments');

// Users
router.post('/users', (req, res) => requestHandler(users.add, req, res));
router.put('/users/:userId', (req, res) => requestHandler(users.updateOne, req, res));
router.get('/users', (req, res) => requestHandler(users.getMany, req, res));
router.get('/users/:userInfo', (req, res) => requestHandler(users.getOne, req, res));

// Appointments
router.get('/users/:userEmail/appointments', (req, res) => requestHandler(appointments.getMany, req, res));
router.get('/appointments/:appointmentId', (req, res) => requestHandler(appointments.getOne, req, res));
router.post('/users/:userEmail/appointments', (req, res) => requestHandler(appointments.add, req, res));
router.patch('/appointments/:appointmentId', (req, res) => requestHandler(appointments.updateById, req, res));

// Invoices
router.get('/users/:userEmail/payments', (req, res) => requestHandler(invoices.getPaymentsOfUser, req, res))

// Services
router.get('/services', (req, res) => requestHandler(services.getAll, req, res));

// Feedback
router.get('/users/:userEmail/feedback', (req, res) => requestHandler(feedback.getMany, req, res));
router.get('/users/:userEmail/feedback/ratings', (req, res) => requestHandler(feedback.getRatings, req, res));

// Conversations
router.get('/users/:userEmail/conversations', (req, res) => requestHandler(conversations.getMany, req, res));
router.post('/users/:userEmail/conversations', (req, res) => requestHandler(conversations.addOne, req, res));
router.patch('/users/:userEmail/conversations/:conversationId', (req, res) => requestHandler(conversations.updateOne, req, res));

// Stripe payments
router.get('/success', (req, res) => requestHandler(stripePayments.successPayment, req, res))
router.get('/cancel', (req, res) => requestHandler(stripePayments.cancel, req, res))
router.post('/create-checkout-session', (req, res) => requestHandler(stripePayments.createCheckoutSession, req, res))

module.exports = router;