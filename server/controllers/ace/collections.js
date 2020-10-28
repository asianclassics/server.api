const express = require('express')
const router = express.Router()
const { getCollectionsText } = require('../../models/ace/getCollectionsText')
const {
    getCollectionsCatalog,
} = require('../../models/ace/getCollectionsCatalog')

router.get('/', async (_, response) => {
    try {
        const textResults = await getCollectionsText()
        console.log('texts', textResults.aggregations)
        const catalogResults = await getCollectionsCatalog()
        console.log('catalogs', catalogResults.aggregations)
        return response.send({ textResults, catalogResults })
    } catch (error) {
        console.log(error)
        return response.send(error.message)
    }
})

module.exports = router
