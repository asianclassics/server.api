const express = require('express')
const stripe = require('stripe')
const { createQueryFile } = require('../../tools/createQueryFile')
const router = express.Router()

let endpointSecret = process.env.STRIPE_SIGNATURE
let logFilePath = '/root/logs'

if (process.env.NODE_ENV !== 'production') {
    endpointSecret = process.env.STRIPE_DEVELOPMENT
    logFilePath = './server/log'
}

console.log(endpointSecret)

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
            const paymentIntent = event.data.object
            createQueryFile(
                paymentIntent,
                `${logFilePath}/event_${event.type}.json`
            )
            console.log('PaymentIntent was successful MEOWYYZZ!')
            break
        case 'payment_method.attached':
            const paymentMethod = event.data.object
            createQueryFile(
                paymentMethod,
                `${logFilePath}/event_${event.type}.json`
            )
            console.log('PaymentMethod was attached to a Customer!')
            break
        // ... handle other event types
        case 'charge.succeeded':
            const charge = event.data.object
            createQueryFile(charge, `${logFilePath}/event_${event.type}.json`)
            console.log('charge')
            break
        default:
            createQueryFile(
                event.data.object,
                `${logFilePath}/event_${event.type}.json`
            )
            console.log(`Unhandled event type ${event.type}`)
    }

    // Return a response to acknowledge receipt of the event
    response.json({ received: true })
})

module.exports = router
