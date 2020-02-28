const express = require('express')

const { searchTest } = require('../../queries/tests/qSearchTest')

const router = express.Router()

/**
 * GET /search
 * Search for a term in the catalog
 * Query Params -
 * term: string under 100 characters
 * offset: positive integer
 */

router.get('/', async (_, response) => {
    try {
        const testResults = await searchTest()

        console.log('test result', testResults)

        return response.send(testResults)
    } catch (error) {
        console.log('test error', error)
        return response.send(error.message)
    }
})

module.exports = router
