const express = require('express')
const stripe = require('stripe')
const { createQueryFile } = require('../../tools/createQueryFile')
const { flatten } = require('../../tools/json/flatten')
const { parsePaymentIntent } = require('../../tools/stripe/parsePaymentIntent')
const { putPaymentIntent } = require('../../models/stripe/putPaymentIntent')
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
            console.log('ooooo pee')
            //const pp = parsePaymentIntent(event.data.object.id)
            // stripe.client_secret = process.env.STRIPE_PRODUCTION
            // const paymentIntent = await stripe.paymentIntents.retrieve(
            //     event.data.object.id
            // )
            // createQueryFile(
            //     flatten(paymentIntent),
            //     `${logFilePath}/pi_${event.type}.json`
            // )
            const paymentIntent = flatten(event.data.object)
            let { body } = await putPaymentIntent(paymentIntent)
            console.log('body', body)
            createQueryFile(
                paymentIntent,
                `${logFilePath}/event_${event.type}.json`
            )
            break
        case 'payment_method.attached':
            createQueryFile(
                flatten(event.data.object),
                `${logFilePath}/event_${event.type}.json`
            )
            break
        // ... handle other event types
        case 'charge.succeeded':
            const charge = flatten(event.data.object)
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
