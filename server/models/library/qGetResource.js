const { client } = require('../../connection')
const { setIndex } = require('../../parsers/setIndex')

// next refactor the build query section
module.exports = {
    getResource(params) {
        const index = setIndex(params)
        const body = {
            query: {
                ids: {
                    values: [params.id],
                },
            },
            _source: {
                excludes: ['@*'],
            },
        }
        return client.search({ index, body })
    },
}
