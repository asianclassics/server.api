const express = require('express')
const { check, validationResult } = require('express-validator')
const { getEText } = require('../../queries/ace/getEText')
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
    ],
    async (request, response) => {
        try {
            const { id } = request.params
            console.log(id)
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                console.log('improper id string')
                const msgs = getErrorMessages(errors)
                return response.send(`Error => ${msgs}`)
            }

            const results = await getEText(id)
            if (results.hits.total === 0) {
                return response.send(`Error: No match for id, ${id}`)
            }
            return response.send(results.hits)
        } catch (error) {
            return response.send(error)
        }
    }
)

module.exports = router
