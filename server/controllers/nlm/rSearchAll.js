const express = require('express')
const { check, validationResult } = require('express-validator')
const { qSearchAll } = require('../../models/nlm/qSearchAll')
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
        check('after').optional(),
        check('offset', 'must be zero or positive integer')
            .isInt({ gt: -1 })
            .optional(),
    ],
    async (request, response) => {
        try {
            const { term, offset, filterArray } = request.query
            //console.log(term, filterArray, offset, filterType, filterTerm)
            //let fArr = filterArray ? JSON.parse(filterArray) : null
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                const msgs = getErrorMessages(errors)
                return response.send(`Error => ${msgs}`)
            }
            console.log('f', filterArray)
            //console.log('a', filterArray ? JSON.parse(filterArray) : 'meow')
            const searchResults = await qSearchAll(term, offset, filterArray)
            // console.log({
            //     RESULTS: searchResults.hits,
            //     AGGS: searchResults.aggregations,
            // })
            return response.send({
                RESULTS: searchResults.body.hits,
                AGGS: searchResults.body.aggregations,
            })
        } catch (error) {
            console.log(error)
            return response.send(error.message)
        }
    }
)

module.exports = router
