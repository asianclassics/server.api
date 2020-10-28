const { client, es } = require('../../connection')

// IDS Query
module.exports = {
    getCatalog(id) {
        const index = es.indices.catalog
        const body = {
            query: {
                ids: {
                    values: [id],
                },
            },
            _source: {
                excludes: ['catnonorm', '@*', 'textfmt'],
            },
        }
        return client.search({ index, body })
    },
}
