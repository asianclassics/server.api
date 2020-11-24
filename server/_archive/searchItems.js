const express = require('express')
const { check, validationResult } = require('express-validator')
const { searchItemsPhrase } = require('../../models/library/searchItemsPhrase')
const { getErrorMessages } = require('../routeUtilities')
const router = express.Router()

/**
 * GET /search
 * Search for a term in the catalog
 * Query Params -
 * term: string under 100 characters
 * offset: positive integer
 */

router.get(
    '/',
    [
        check('offset', 'must be zero or positive integer')
            .isInt({ gt: -1 })
            .optional(),
    ],
    async (request, response) => {
        try {
            const { term, offset } = request.query
            console.log(term)
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                const msgs = getErrorMessages(errors)
                return response.send(`Error => ${msgs}`)
            }

            const results = await searchItemsPhrase(term, offset)
            console.log(results)
            return response.send({
                results,
            })
        } catch (error) {
            console.log(error)
            return response.send(error.message)
        }
    }
)

module.exports = router
