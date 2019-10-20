const express = require('express')
const router = express.Router()
const { getCollections } = require('../queries/getCollections')

// HEALTH OF ELASTICSEARCH CLUSTER
router.get('/', async (request, response) => {
    try {
        let { clause } = request.query
        if (!clause) {
            console.log('no filter clause sent')
            clause = []
        }
        const collectionsResults = await getCollections(clause)
        return response.send(collectionsResults)
    } catch (error) {
        console.log(error)
        return response.send(error.message)
    }
})

module.exports = router
