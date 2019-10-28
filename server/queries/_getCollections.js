const { client, indices, type } = require('../connection')

let coll = []
// IDS Query
module.exports = {
    getCollectionsText(filterClause) {
        let body, query
        const index = indices.etext

        const aggs = {
            collections: {
                terms: {
                    field: 'collection.keyword',
                    order: { _count: 'desc' },
                },
            },
        }

        if (filterClause.length === 0) {
            body = {
                size: 0,
                aggregations: aggs,
            }
        } else {
            filterClause.forEach(c => coll.push(JSON.parse(c)))
            query = {
                bool: {
                    filter: {
                        bool: {
                            should: [coll],
                        },
                    },
                },
            }
            body = {
                size: 0,
                aggregations: aggs,
                query: query,
            }
        }
        return client.search({ index, type, body })
    },
}
