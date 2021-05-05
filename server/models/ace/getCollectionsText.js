const { client } = require('../../connection')
const { elastic } = require('../../statics')

// IDS Query
module.exports = {
    getCollectionsText() {
        const index = elastic.indices.etext

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
        //console.log('c body', body)
        return client.search({ index, body })
    },
}
