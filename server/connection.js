const elasticsearch = require('elasticsearch')
// Core ES variables for this project
const es = {
    indices: {
        catalog: 'v1_acip_catalogs',
        etext: 'v2_acip_etexts',
        nlmIndex: 'v1_bdrc_work',
        nlmIndexPrefix: 'v1_bdrc_',
        resources: 'v1_works_test',
    },
    resultSetSize: 10,
    version: 'v1',
    initialSearchFields: ['bibframe', 'all'],
    // type: 'doc' // deprecated
}

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
    es,
}
