const express = require('express')
const { check, validationResult } = require('express-validator')
const { qSearchByID } = require('../../queries/nlm/qFetchID')
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
            const { ids, code } = request.query

            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                const msgs = getErrorMessages(errors)
                return response.send(`Error => ${msgs}`)
            }
            console.log(ids, JSON.parse(ids))
            const searchByIDResults = await qSearchByID(JSON.parse(ids), code)

            return response.send(searchByIDResults.body)
        } catch (error) {
            console.log(error)
            return response.send(error.message)
        }
    }
)

module.exports = router
