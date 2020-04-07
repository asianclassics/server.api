const elasticsearch = require('elasticsearch')
console.log(process.env.ES_CLOUD_HOST)
// Core ES variables for this project
const indices = {
    catalog: 'acip_catalogs',
    etext: 'acip_etexts',
    nlmIndex: 'v1_bdrc_work',
    nlmIndexPrefix: 'v1_bdrc_',
}

const resultSetSize = 10
const type = 'doc'

// old connection
// const port = process.env.ES_PORT || 9200
// const host = process.env.ES_HOST || '157.230.172.69'
// const client = new elasticsearch.Client({ host: { host, port } })

// new connection in Elastic Cloud
const client = new elasticsearch.Client({
    host: process.env.ES_CLOUD_HOST,
})

// this is new way to connect to elastic cloud, but not working for me right now.
// const client = new elasticsearch.Client({
//     cloud: {
//         id: process.env.ES_CLOUD_ID,
//     },
//     auth: {
//         username: process.env.ES_CLOUD_USER,
//         password: process.env.ES_CLOUD_PASSWORD,
//     },
// })

module.exports = {
    client,
    indices,
    type,
    resultSetSize,
}
