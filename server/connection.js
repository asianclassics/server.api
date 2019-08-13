const elasticsearch = require('elasticsearch')

// Core ES variables for this project
const indices = {
    catalog: 'mongolia_catalog',
    etext: 'acip_update',
}

const resultSetSize = 10
const type = 'doc'
const port = process.env.ES_PORT || 9200
const host = process.env.ES_HOST || '157.230.172.69'
const client = new elasticsearch.Client({ host: { host, port } })

module.exports = {
    client,
    indices,
    type,
    resultSetSize,
}
