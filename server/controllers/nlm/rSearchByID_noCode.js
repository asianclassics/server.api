const express = require('express')
const { check, validationResult } = require('express-validator')
const { qSearchByIDNoCode } = require('../../models/nlm/qSearchByID_noCode')
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
            const { collection, offset } = request.query

            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                const msgs = getErrorMessages(errors)
                return response.send(`Error => ${msgs}`)
            }

            const searchByIDResults = await qSearchByIDNoCode(
                JSON.parse(collection),
                offset
            )

            return response.send(searchByIDResults)
        } catch (error) {
            console.log(error)
            return response.send(error.message)
        }
    }
)

module.exports = router
