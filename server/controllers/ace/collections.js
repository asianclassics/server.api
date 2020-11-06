const express = require('express')
const router = express.Router()
const { getCollectionsText } = require('../../models/ace/getCollectionsText')
const {
    getCollectionsCatalog,
} = require('../../models/ace/getCollectionsCatalog')

router.get('/', async (_, response) => {
    try {
        let textResults = await getCollectionsText()
        textResults = textResults.body
        let catalogResults = await getCollectionsCatalog()
        catalogResults = catalogResults.body
        //console.log('catalogs', catalogResults.body.aggregations)
        return response.send({ textResults, catalogResults })
    } catch (error) {
        console.log(error)
        return response.send(error.message)
    }
})

module.exports = router
