/**
 * GET /resources
 * Search for a term in the library
 * Query Params -
 * class:
 * filter:
 * q:
 * near:
 * include_data:
 * search_fields:
 * page:
 * page_size:
 * highlights:
 */

const express = require('express')
const { validationResult } = require('express-validator')
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

        // print out params in dev
        if (process.env.NODE_ENV !== 'production') {
            console.log(request.query)
        }

        // send params to elasticsearch DSL
        const { body } = await getResourceListing(request.query)

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
        return response.send(body.hits)
    } catch (error) {
        return response.send(error)
    }
})

module.exports = router
