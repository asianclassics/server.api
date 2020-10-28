const express = require('express')
const { check, validationResult } = require('express-validator')
const {
    searchETextPhraseTesting,
} = require('../../models/ace/searchETextPhraseTesting')
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
        check(
            'term',
            'must be string with length between 1 and 100 characters'
        ).isLength({ min: 1, max: 100 }),
    ],
    async (request, response) => {
        try {
            const { term, offset } = request.query
            //console.log(term, offset)
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                const msgs = getErrorMessages(errors)
                return response.send(`Error => ${msgs}`)
            }
            const collection = { t: ['bdr:W1NLM16'] }
            //const { c: t } = JSON.parse(collection)
            console.log('c?', collection.t)
            //console.log('query params', offset, term)
            const textResults = await searchETextPhraseTesting(
                term,
                offset,
                collection.t
            )

            console.log('result?', textResults)

            return response.send(textResults)
        } catch (error) {
            //console.log(error)
            return response.send(error.message)
        }
    }
)

module.exports = router
