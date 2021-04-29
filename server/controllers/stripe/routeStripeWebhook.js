const express = require('express')
const stripe = require('stripe')
const { createQueryFile } = require('../../tools/createQueryFile')
const { flatten } = require('../../tools/json/flatten')
const { parsePaymentIntent } = require('../../tools/stripe/parsePaymentIntent')
const { putStripeRecord } = require('../../models/stripe/putStripeRecord')
const router = express.Router()

let endpointSecret = process.env.STRIPE_SIGNATURE
let logFilePath = '/home/joel/logs'

if (process.env.NODE_ENV !== 'production') {
    endpointSecret = process.env.STRIPE_DEVELOPMENT
    logFilePath = './server/log'
}

router.post('/', async (request, response) => {
    const sig = request.headers['stripe-signature']

    let event

    try {
        event = await stripe.webhooks.constructEvent(
            request.body,
            sig,
            endpointSecret
        )
    } catch (err) {
        response.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = flatten(event.data.object)
            await putStripeRecord(paymentIntent, 'f1_stripe_payment_intents')
            createQueryFile(
                paymentIntent,
                `${logFilePath}/event_${event.type}.json`
            )
            break
        case 'invoice.paid':
            const invoice = flatten(event.data.object)
            await putStripeRecord(invoice, 'f1_stripe_invoice_paid')
            createQueryFile(invoice, `${logFilePath}/event_${event.type}.json`)
            break
        case 'charge.succeeded':
            const charge = flatten(event.data.object)
            await putStripeRecord(charge, 'f1_stripe_charge')
            createQueryFile(charge, `${logFilePath}/event_${event.type}.json`)
            break
        default:
            createQueryFile(
                flatten(event.data.object),
                `${logFilePath}/event_${event.type}.json`
            )
            console.log(`Unhandled event type ${event.type}`)
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true })
})

module.exports = router
