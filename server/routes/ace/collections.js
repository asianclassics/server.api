const express = require('express')
const router = express.Router()
const { getCollectionsText } = require('../../queries/ace/getCollectionsText')
const {
    getCollectionsCatalog,
} = require('../../queries/ace/getCollectionsCatalog')

// HEALTH OF ELASTICSEARCH CLUSTER
router.get('/', async (_, response) => {
    try {
        const textResults = await getCollectionsText()
        console.log('texts', textResults.hits)
        const catalogResults = await getCollectionsCatalog()
        return response.send({ textResults, catalogResults })
    } catch (error) {
        console.log(error)
        return response.send(error.message)
    }
})

module.exports = router
