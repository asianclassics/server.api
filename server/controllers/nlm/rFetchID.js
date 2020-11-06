const express = require('express')
const { check, validationResult } = require('express-validator')
const { qFetchID } = require('../../models/nlm/qFetchID')
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
            const { ids, lengthIDs, code } = request.query

            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                const msgs = getErrorMessages(errors)
                return response.send(`Error => ${msgs}`)
            }
            //console.log(ids, JSON.parse(ids))
            const fetchByIDResults = await qFetchID(
                JSON.parse(ids),
                parseInt(lengthIDs),
                code
            )

            const searchByIDResults = await qSearchByIDNoCode(
                JSON.parse(ids),
                0,
                30
            )
            //console.log(searchByIDResults)
            return response.send({
                ID: fetchByIDResults.body,
                RELATED: searchByIDResults.body,
            })
        } catch (error) {
            console.log(error)
            return response.send(error.message)
        }
    }
)

module.exports = router
