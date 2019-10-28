const express = require('express')
const { check, validationResult } = require('express-validator')
const { searchETextPhrase } = require('../queries/searchETextPhrase')
const { getErrorMessages } = require('./routeUtilities')
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
            const { def, offset, filterClause } = request.query
            const { texts } = JSON.parse(filterClause)
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                const msgs = getErrorMessages(errors)
                return response.send(`Error => ${msgs}`)
            }
            const textResults = await searchETextPhrase(def, offset, texts)

            return response.send(textResults)
        } catch (error) {
            //console.log(error)
            return response.send(error.message)
        }
    }
)

module.exports = router
