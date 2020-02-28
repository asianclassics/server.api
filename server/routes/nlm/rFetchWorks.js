const express = require('express')
const { qFetchByCode } = require('../../queries/nlm/qFetchByCode')
const { check, validationResult } = require('express-validator')
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
            const { offset } = request.query
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                const msgs = getErrorMessages(errors)
                return response.send(`Error => ${msgs}`)
            }

            const workResults = await qFetchByCode('W', offset)
            //console.log(results)
            return response.send(workResults)
        } catch (error) {
            console.log(error)
            return response.send(error.message)
        }
    }
)

module.exports = router
