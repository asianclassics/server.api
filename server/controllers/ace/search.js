const express = require('express')
const { check, validationResult } = require('express-validator')
const { searchCatalogPhrase } = require('../../models/ace/searchCatalogPhrase')
const { searchETextPhrase } = require('../../models/ace/searchETextPhrase')
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
            const { def, offset, filterClause, limiters } = request.query
            const { catalogs: filterCatalogs, texts: filterTexts } = JSON.parse(
                filterClause
            )
            const {
                catalogs: limiterCatalogs,
                texts: limiterTexts,
            } = JSON.parse(limiters)
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
            const textResults = await searchETextPhrase(
                def,
                offset,
                filterTexts,
                limiterTexts
            )

            return response.send({
                catalogs: catalogResults.body,
                texts: textResults.body,
            })
        } catch (error) {
            console.log(error)
            return response.send(error.message)
        }
    }
)

module.exports = router
