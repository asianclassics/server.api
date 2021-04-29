const stripe = require('stripe')

const parsePaymentIntent = async (id) => {
    console.log('i got id', id)
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(
            'pi_1IAcciBJ6cz979G2Oq7RAvkT'
        )
        return paymentIntent
    } catch (error) {
        console.log(error)
    }
}

module.exports = parsePaymentIntent
