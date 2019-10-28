const express = require('express')
const { check, validationResult } = require('express-validator')
const { searchCatalogPhrase } = require('../queries/searchCatalogPhrase')
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
        check('after').optional(),
        check('offset', 'must be zero or positive integer')
            .isInt({ gt: -1 })
            .optional(),
    ],
    async (request, response) => {
        try {
            const { def, offset, filterClause, limiters } = request.query
            const { catalogs: filterCatalogs } = JSON.parse(filterClause)
            const { catalogs: limiterCatalogs } = JSON.parse(limiters)
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                const msgs = getErrorMessages(errors)
                return response.send(`Error => ${msgs}`)
            }

            const catalogResults = await searchCatalogPhrase(
                def,
                offset,
                filterCatalogs,
                limiterCatalogs
            )
            return response.send(catalogResults)
        } catch (error) {
            console.log(error)
            return response.send(error.message)
        }
    }
)

module.exports = router
