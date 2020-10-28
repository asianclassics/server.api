const { client, es } = require('../../connection')

module.exports = {
    getResource({ id }) {
        const index = es.indices.resources
        const body = {
            query: {
                ids: {
                    values: [id],
                },
            },
            _source: {
                excludes: ['@*'],
            },
        }
        return client.search({ index, body })
    },
}
