const { client, indices, type } = require('../connection')

// IDS Query
module.exports = {
    getCatalog(id) {
        const index = indices.catalog
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
        return client.search({ index, type, body })
    },
}
