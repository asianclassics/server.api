const express = require('express')
const { client } = require('../server/connection')

const router = express.Router()

// HEALTH OF ELASTICSEARCH CLUSTER
router.get('/', (_, response) => {
    console.log('getting health...')
    client.cluster.health({}, (esError, esResponse, status) => {
        if (esError) {
            console.log('-- Client Health ERROR--', status, esError)
            response.send(esError)
        } else {
            console.log('-- Client Health --', status, esResponse)
            response.send(esResponse)
        }
    })
})

module.exports = router
