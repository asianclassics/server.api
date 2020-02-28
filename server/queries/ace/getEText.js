const { client, indices, type } = require('../../connection')

module.exports = {
    getEText(id) {
        const index = indices.etext
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
        return client.search({ index, type, body })
    },
}
