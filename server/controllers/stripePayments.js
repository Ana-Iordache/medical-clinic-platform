require('dotenv').config();
// the secret key should be placed in .env file at the same level as index.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const config = require('../../config.json');
const Appointments = require('../models/Appointments');

const urls = {
    frontend: `http://${config.FRONTEND_HOST}:${config.FRONTEND_PORT}`,
    backend: `http://${config.BACKEND_HOST}:${config.BACKEND_PORT}`
}

async function createCheckoutSession(req, res) {
    const { productsToPay, details } = req.body;
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: productsToPay,
        mode: "payment",
        success_url: `${urls.backend}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${urls.frontend}/payments?paymentStatus=canceled`,
        metadata: details
    })
    res.json({ url: session.url })
}

async function successPayment(req, res) {
    const sessionId = req.query.session_id;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paymentStatus = session.payment_status;
    if (paymentStatus == "paid") {
        const appointmentId = session.metadata.appointmentId;
        const amount = session.metadata.amount;
        const appointmentUpdated = await updateInvoiceOfAppointment(appointmentId, amount, paymentStatus);
        console.log("Invoice of appointment updated: ", appointmentUpdated);
    } 
    
    res.redirect(`${urls.frontend}/payments?paymentStatus=${paymentStatus}`);
}

async function updateInvoiceOfAppointment(appointmentId, amount, status) {
    return await Appointments.findOneAndUpdate(
        { _id: appointmentId }, 
        { 
            $set: {
                "invoice.amount": amount,
                "invoice.status": status
            }
        },
        { new: true }
    )
}

async function cancel(req, res) {
    res.send("Payment canceled.")
}

module.exports = {
    successPayment,
    createCheckoutSession,
    cancel
}