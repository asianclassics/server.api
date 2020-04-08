const { client, indices } = require('../../connection')

// IDS Query
module.exports = {
    getCollectionsText() {
        const index = indices.etext

        const aggs = {
            collections: {
                terms: {
                    field: 'collection',
                    order: { _count: 'desc' },
                },
            },
        }

        const body = {
            size: 0,
            aggregations: aggs,
        }
        console.log('c body', body)
        return client.search({ index, body })
    },
}
