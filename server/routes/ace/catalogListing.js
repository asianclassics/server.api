const express = require('express')
const { getCatalogListing } = require('../../queries/ace/getCatalogListing')
const router = express.Router()

/**
 * GET /catalogs
 * Return listing of all catalog records
 **/

router.get('/', async (_, response) => {
    try {
        const results = await getCatalogListing()
        return response.send(results.hits)
    } catch (error) {
        console.log('catalog route error, ', error)
    }
})

module.exports = router
