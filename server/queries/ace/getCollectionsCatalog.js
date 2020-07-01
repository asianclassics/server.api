const { client, es } = require('../../connection')

// IDS Query
module.exports = {
    getCollectionsCatalog() {
        const index = es.indices.catalog

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

        return client.search({ index, body })
    },
}
