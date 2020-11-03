const { client } = require('../../connection')
const { elastic } = require('../../statics')

// IDS Query
module.exports = {
    getCatalog(id) {
        const index = elastic.indices.catalog
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
