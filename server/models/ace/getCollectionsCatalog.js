const { client } = require('../../connection')
const { elastic } = require('../../statics')

// IDS Query
module.exports = {
    getCollectionsCatalog() {
        const index = elastic.indices.catalog

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
