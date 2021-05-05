const express = require('express')
const { validationResult } = require('express-validator')
const { getResource } = require('../../models/library/qGetResource')
const {
    validateRequiredId,
    validateIncludeData,
} = require('../../tools/validation')
const { postProcessCitation } = require('../../tools/postProcessing')
const { INCLUDE_CITATION } = require('../../statics').URLparams
const router = express.Router()
/**
 * GET /:id
 * Search for a term in the library
 * Query Params -
 * id: sting, length > 4 and < 20
 */

const checkParams = [validateRequiredId, validateIncludeData]

router.get(['/:id'], checkParams, async (request, response) => {
    try {
        // validate the params
        const errors = validationResult(request)
        if (!errors.isEmpty()) {
            return response.status(422).json({ errors: errors.array() })
        }

        // print out params in dev
        if (process.env.NODE_ENV !== 'production') {
            console.log(request.query, request.params)
        }

        const { body } = await getResource(request.params, request.query)

        if (body.hits.total.value === 0) {
            return response.status(422).json({
                errors: [{ msg: `No match for id, ${request.params.id}` }],
            })
        } else if (
            INCLUDE_CITATION in request.query &&
            String(request.query[INCLUDE_CITATION]).toLowerCase() == 'true'
        ) {
            //console.log('include the citation yo...post processing')
            postProcessCitation(body, request.params.id)
        }

        return response.send(body.hits)
    } catch (error) {
        const { body, statusCode, message } = error
        //console.log(statusCode, body, message)
        if (statusCode == 404) {
            return response.status(422).json({
                errors: [{ msg: `No match for id, ${request.params.id}` }],
            })
        }

        return response.send(error)
    }
})

module.exports = router
