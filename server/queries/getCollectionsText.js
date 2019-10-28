const { client, indices, type } = require('../connection')

// IDS Query
module.exports = {
    getCollectionsText() {
        const index = indices.etext

        const aggs = {
            collections: {
                terms: {
                    field: 'collection.keyword',
                    order: { _count: 'desc' },
                },
            },
        }

        const body = {
            size: 0,
            aggregations: aggs,
        }

        return client.search({ index, type, body })
    },
}
