const elasticsearch = require('elasticsearch')

// Core ES variables for this project
const indices = {
    catalog: 'acip_catalogs',
    etext: 'acip_etexts',
    nlmIndex: 'v5_bdrc_work',
    nlmIndexPrefix: 'v5_bdrc_',
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
