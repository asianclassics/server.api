const express = require('express')
const { getCatalogListing } = require('../../models/ace/getCatalogListing')
const router = express.Router()

/**
 * GET /catalogs
 * Return listing of all catalog records
 **/

router.get('/', async (_, response) => {
    try {
        const results = await getCatalogListing()
        return response.send(results.body.hits)
    } catch (error) {
        console.log('catalog route error, ', error)
    }
})

module.exports = router
