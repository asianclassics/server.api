const { client } = require('../../connection')
const { elastic } = require('../../statics')

module.exports = {
    getEText(id) {
        const index = elastic.indices.etext
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
