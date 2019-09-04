const express = require('express')
const { check, validationResult } = require('express-validator')
const { searchCatalogPhrase } = require('../queries/searchCatalogPhrase')
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
        check(
            'term',
            'must be string with length between 1 and 100 characters'
        ).isLength({ min: 1, max: 100 }),
    ],
    async (request, response) => {
        try {
            const { term, offset } = request.query
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                const msgs = getErrorMessages(errors)
                return response.send(`Error => ${msgs}`)
            }
            //console.log('query params', offset, term)
            const catalogResults = await searchCatalogPhrase(term, offset)
            const textResults = await searchETextPhrase(term, offset)
            return response.send({
                catalogs: catalogResults,
                texts: textResults,
            })
        } catch (error) {
            console.log(error)
            return response.send(error.message)
        }
    }
)

module.exports = router
