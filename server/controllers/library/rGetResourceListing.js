/**
 * GET /:id
 * Search for a term in the library
 * Query Params -
 * id: sting, length > 4 and < 20
 */

const express = require('express')
const { validationResult, check } = require('express-validator')
const {
    getResourceListing,
} = require('../../models/library/qGetResourceListing')

const {
    validateClassAndQ,
    validateSearchFields,
    validateIncludeData,
    validateFilter,
} = require('../../tools/validation')

const router = express.Router()

const checkParams = [
    validateClassAndQ,
    validateSearchFields,
    validateIncludeData,
    validateFilter,
]

router.get(['/'], checkParams, async (request, response) => {
    try {
        // validate the params
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() })
        }

        console.log(request.query)

        // send params to elasticsearch DSL
        const { body } = await getResourceListing(request.query)
        //console.log(typeof body)
        //console.log(body)
        // if no results, search for id's like this...? maybe add an option for that.
        if (body.hits.total.value === 0) {
            return response.status(422).json({
                errors: [
                    {
                        msg: `No matches for provided parameters, ${JSON.stringify(
                            request.query
                        )}`,
                    },
                ],
            })
        }

        // return result
        return response.send(body.hits.hits)
    } catch (error) {
        return response.send(error)
    }
})

module.exports = router
