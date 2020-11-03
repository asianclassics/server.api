const express = require('express')
const { check, validationResult } = require('express-validator')
const { getResource } = require('../../models/library/qGetResource')
const router = express.Router()
/**
 * GET /:id
 * Search for a term in the library
 * Query Params -
 * id: sting, length > 4 and < 20
 */

const checkParams = [
    check(
        'id',
        'ID string must be provided, with minimum length of 5 characters'
    ).isLength({ min: 5, max: 40 }),
]

router.get(['/:id'], checkParams, async (request, response) => {
    try {
        // validate the params
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() })
        }

        // build query and send to elasticsearch DSL
        const results = await getResource(request.params)

        // if no results, search for id's 'like' this...? maybe add an option for that.
        if (results.body.hits.total.value === 0) {
            return response.status(422).json({
                errors: [{ msg: `No match for id, ${request.params.id}` }],
            })
        }

        // return result
        return response.send(results.body.hits.hits[0]._source)
    } catch (error) {
        return response.send(error)
    }
})

module.exports = router
