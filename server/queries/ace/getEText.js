const { client, es } = require('../../connection')

module.exports = {
    getEText(id) {
        const index = es.indices.etext
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
