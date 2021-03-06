const express = require('express')
const { check, validationResult } = require('express-validator')
const {
    getFullTextAndSearch,
} = require('../../models/ace/getFullTextAndSearch')
const { getErrorMessages } = require('../routeUtilities')
const router = express.Router()
/**
 * GET /:id
 * Search for a term in the library
 * Query Params -
 * id: sting, length > 4 and < 20
 */

router.get(
    ['/', '/:id'],
    [
        check(
            'id',
            'ID string must be provided, with minimum length of 5 characters'
        ).isLength({ min: 5, max: 40 }),
        check(
            'term',
            'must be string with length between 1 and 100 characters'
        ).isLength({ min: 1, max: 100 }),
    ],
    async (request, response) => {
        try {
            const { id } = request.params
            const { term, def } = request.query

            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                console.log('improper id or term string')
                const msgs = getErrorMessages(errors)
                return response.send(`Error => ${msgs}`)
            }

            const results = await getFullTextAndSearch(id, def)
            //console.log('full text results', results)
            if (results.body.hits.total === 0) {
                return response.send(`Error: No match for id, ${id}`)
            }
            return response.send(results.body.hits)
        } catch (error) {
            return response.send(error)
        }
    }
)

module.exports = router
