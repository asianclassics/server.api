const express = require('express')
const { validationResult } = require('express-validator')
const { getResource } = require('../../models/library/qGetResource')
const { validateRequiredId } = require('../../tools/validation')
const router = express.Router()
/**
 * GET /:id
 * Search for a term in the library
 * Query Params -
 * id: sting, length > 4 and < 20
 */

const checkParams = [validateRequiredId]

router.get(['/:id'], checkParams, async (request, response) => {
    try {
        // validate the params
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() })
        }

        const { body } = await getResource(request.params)

        if (body.hits.total.value === 0) {
            return response.status(422).json({
                errors: [{ msg: `No match for id, ${request.params.id}` }],
            })
        }
        // return result
        return response.send(body.hits.hits[0]._source)
    } catch (error) {
        const { body, statusCode, message } = error
        console.log(statusCode, body, message)
        if (statusCode == 404) {
            return response.status(422).json({
                errors: [{ msg: `No match for id, ${request.params.id}` }],
            })
        }

        return response.send(error)
    }
})

module.exports = router
